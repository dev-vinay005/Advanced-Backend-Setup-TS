import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { corsUrl, environment, port } from "./config.js";
import todoRouter from "./routes/todoRoutes.js";
import { connectDB } from "./database/index.js";
import { ApiError, ErrorType } from "./core/ApiError.js";
import Logger from "./core/Logger.js";
import { InternalServerError } from "./core/CustomError.js";
import { redisConnection } from "./cache/index.js";

const PORT = port ?? 8080;

export const app: express.Application = express();

app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/todo", todoRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    Logger.error(
      `${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.ip}`,
    );

    return ApiError.handle(err, res);
  }

  Logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.ip}`);

  Logger.error(err.stack);

  return ApiError.handle(new InternalServerError(), res);
});

// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//   if (err instanceof ApiError) {
//     ApiError.handle(err, res);

//     if (err.errorType === ErrorType.INTERNAL_SERVER_ERROR) {
//       Logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.ip}`);
//     } else {
//       Logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.ip}`);
//       Logger.error(err.stack);
//     }

//     if (environment === "development") {
//       res.status(500).send({
//         message: err.message,
//         stack: err.stack,
//       });
//     }
//     ApiError.handle(new InternalServerError(), res);
//   }
// });

app.listen(PORT, async () => {
  await connectDB();
  await redisConnection();
  console.log(`Server is running on port ${PORT}`);
});
