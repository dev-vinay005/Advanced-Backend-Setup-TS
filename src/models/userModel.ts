import mongoose, { Document, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

export interface UserDoc extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
