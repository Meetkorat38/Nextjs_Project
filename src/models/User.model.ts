import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifiedCode: string;
  verifyCodeExpiry: Date;
  isVerify: boolean;
  isAcceptMessage: boolean;
  message: Message[];
}

const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username must be provided"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email must be provided"],
    unique: true,
    match: [
      /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/gim,
      "please provide a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Password must be provided"],
  },
  verifiedCode: {
    type: String,
    required: [true, "Verified must be provided"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },

  isVerify: {
    type: Boolean,
    default: false,
  },
  isAcceptMessage: {
    type: Boolean,
    default: true,
  },
  message: [MessageSchema],
});

export const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
