import express, { Router } from "express";
import {
  createTodo,
  getTodos,
  editTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { protect } from "../middleware/authMiddleware.js";
import apiKey from "../auth/apiKey.js";
import { validateRequest, ValidationSource } from "../helpers/validator.js";
import schema from "../auth/schema.js";
import { permission } from "../helpers/permission.js";
import { Permission } from "../models/apikeyModel.js";
import authentication from "../auth/authentication.js";
const todoRouter: Router = express.Router();

// todoRouter.use(apiKey);
todoRouter.use(validateRequest(schema.apiKey, ValidationSource.HEADER), apiKey);
todoRouter.use(permission(Permission.GENERAL));
todoRouter.route("/").post(createTodo).get(authentication, getTodos);
todoRouter.route("/:id").put(protect, editTodo).delete(protect, deleteTodo);

export default todoRouter;
