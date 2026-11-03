import mongoose from "mongoose";

export enum Permission {
  GENERAL = "GENERAL",
}

export interface ApiKeyDoc {
  Key: string;
  version: number;
  permissions: Permission[];
  status: boolean;
}

const apiKeySchema = new mongoose.Schema<ApiKeyDoc>(
  {
    Key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    version: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    permissions: {
      type: [
        {
          type: String,
          required: true,
          enum: Object.values(Permission),
        },
      ],
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true },
);

apiKeySchema.index({ Key: 1, status: 1 });

export const apiKeyModel = mongoose.model<ApiKeyDoc>(
  "apiKeyModel",
  apiKeySchema,
);
