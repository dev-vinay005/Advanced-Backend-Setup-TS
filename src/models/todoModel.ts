import mongoose, { Schema } from "mongoose";

export interface TodoDoc extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: string;
}

export enum TodoStatus {
  NOT_STARTED = "not-started",
  IN_PROGRESS = "in-progress",
  DONE = "done",
}

const todoModel = new Schema<TodoDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: TodoStatus.NOT_STARTED,
      enum: Object.values(TodoStatus),
    },
  },
  {
    timestamps: true,
  },
);

const Todo = mongoose.model("Todo", todoModel);

export default Todo;
