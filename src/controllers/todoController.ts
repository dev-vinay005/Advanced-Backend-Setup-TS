import asyncHandler from "express-async-handler";
import Todo from "../models/todoModel.js";
import type { RequestHandler, Response } from "express";
import type { protectedRequest } from "../types/app-request.js";

const createTodo: RequestHandler = asyncHandler(
  async (req: protectedRequest, res: Response) => {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error("Title and Description are required");
    }

    await Todo.create({ user: "6a97c2bb4d1c551a5fbea0ff", title, description });

    res.status(201).json({ title, description });
  },
);

const getTodos: RequestHandler = asyncHandler(
  async (req: protectedRequest, res: Response) => {
    const user = req.user;
    console.log("logging the user in getTodos", user);
    // const user = "6a97c2bb4d1c551a5fbea0ff";
    const todos = await Todo.find({
      user: user,
    });
    res.json(todos);
  },
);

const editTodo: RequestHandler = asyncHandler(
  async (req: protectedRequest, res: Response) => {
    const { title, description, status } = req.body;

    const user = req.user;

    if (!title || !description || !status) {
      res.status(400);
      throw new Error("Title, Description, and Status are required");
    }

    const todo = await Todo.findById(req.params.id);

    if (todo?.user.toString() !== user._id.toString()) {
      res.status(401);
      throw new Error("Not authorized to update this todo");
    }

    if (!todo) {
      res.status(404);
      throw new Error("Todo not found");
    }

    todo.title = title;
    todo.description = description;
    todo.status = status;

    const updatedTodo = await todo.save();

    res.json(updatedTodo);
  },
);

const deleteTodo: RequestHandler = asyncHandler(async (req, res) => {
  const todo = await Todo.findById(req.params.id);

  if (todo) {
    await todo.deleteOne();
    res.json({ message: "Todo removed" });
  } else {
    res.status(404);
    throw new Error("Todo not found");
  }
});

export { createTodo, getTodos, editTodo, deleteTodo };
