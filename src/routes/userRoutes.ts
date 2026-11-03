import express, { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/userController.js";
import { validateRequest, ValidationSource } from "../helpers/validator.js";
import { userLoginSchema } from "./userSchema.js";
import schema from "../auth/schema.js";

const userRouter: Router = express.Router();

userRouter
  .route("/login")
  .post(validateRequest(userLoginSchema, ValidationSource.BODY), loginUser);
userRouter.route("/register").post(registerUser);
userRouter.route("/refresh").post(refreshAccessToken);
userRouter.route("/logout").get(logoutUser);

export default userRouter;
