import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import type { RequestHandler, Response } from "express";
import type { authRequest, protectedRequest } from "../types/app-request.js";
import {
  BadRequestError,
  InvalidCredentialsError,
} from "../core/CustomError.js";
import { userLoginSchema } from "../routes/userSchema.js";
import crypto from "crypto";
import { create } from "./keyStoreController.js";
import type mongoose from "mongoose";
import { createTokens, validateTokenData } from "../auth/utils.js";
import { environment, tokenInfo } from "../config.js";
import { decode, validate } from "../core/JWT.js";
import { Types } from "mongoose";
import { keyStoreModel } from "../models/keyStoreModel.js";

const loginUser: RequestHandler = asyncHandler(
  async (req: protectedRequest, res: Response) => {
    const { email, password } = req.body;
    // Validate the request body using the Zod schema
    const validation = userLoginSchema.safeParse({ email, password });

    if (!validation.success) {
      throw new BadRequestError();
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const accessTokenKey = crypto.randomBytes(64).toString("hex");
      const refreshTokenKey = crypto.randomBytes(64).toString("hex");
      //
      await create(
        user._id as mongoose.Types.ObjectId,
        accessTokenKey,
        refreshTokenKey,
      );

      const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
      res.cookie("accessToken", tokens.accessToken, {
        httpOnly: true,
        secure: environment === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, //ms
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: environment === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, //ms
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "Login Successful",
        // isAdmin: user.isAdmin,
      });
    } else {
      throw new InvalidCredentialsError();
    }
  },
);

const registerUser: RequestHandler = asyncHandler(
  async (req: protectedRequest, res: Response) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already Exists");
    }

    const user = await User.create({ name, email, password });

    if (user) {
      generateToken(res, user._id);
      res.status(201);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        // isAdmin: user.isAdmin,
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Credentials");
    }
  },
);

export const refreshAccessToken = asyncHandler(
  async (req: authRequest, res: Response) => {
    const accessTokenPayload = await decode(req.cookies.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await User.findById(
      new Types.ObjectId(accessTokenPayload.sub),
    );
    if (!user) throw new BadRequestError("User not registered");
    req.user = user;

    const refreshTokenPayload = await validate(
      req.body.refreshToken,
      tokenInfo.secret,
    );
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new BadRequestError("Invalid access token");

    const keystore = await keyStoreModel.find({
      client: req.user,
      primaryKey: accessTokenPayload.prm,
      secondaryKey: refreshTokenPayload.prm,
    });

    if (!keystore) throw new BadRequestError("Invalid access token");
    await keyStoreModel.deleteOne({
      client: req.user,
      primaryKey: accessTokenPayload.prm,
      secondaryKey: refreshTokenPayload.prm,
    });

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await create(req.user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(
      req.user,
      accessTokenKey,
      refreshTokenKey,
    );

    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: environment === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //ms
    });

    res.status(200).json({
      message: "Access Token Refreshed",
    });
  },
);

// const forgotPassword: RequestHandler = asyncHandler(
//   async (req: protectedRequest, res: Response) => {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       res.status(404);
//       throw new Error("User Not Found");
//     }

//     const resetToken = user.createPasswordResetToken();
//     user.save();

//     const resetUrl = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;

//     const message = `Forgot Password? Click on this this link to reset your Password: ${resetUrl}`;

//     try {
//       await sendEmail({
//         email: user.email,
//         subject: "Your Password reset token. (valid for 10mins)",
//         message,
//       });

//       res.status(200).json({
//         message: "Token Sent to email!",
//       });
//     } catch (error) {
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       user.save();
//       console.log(error);

//       res.status(500).json({
//         status: "error",
//         message:
//           "There was an error in sending the email. Please Try again later",
//       });
//     }
//   },
// );

// const resetPassword = asyncHandler(
//   async (req: protectedRequest, res: Response) => {
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.resetToken)
//       .digest("hex");

//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passwordResetExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       res.status(400).json({
//         status: "fail",
//         message: "Token is invalid or has expired",
//       });
//     }

//     user.password = req.body.password;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     user.save();

//     generateToken(res, user._id);

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//     });
//   },
// );

const logoutUser: RequestHandler = asyncHandler(
  async (req: protectedRequest, res: Response) => {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({
      message: "Logged Out Successfully",
    });
  },
);

// export { loginUser, registerUser, logoutUser, forgotPassword, resetPassword };
export { loginUser, registerUser, logoutUser };
