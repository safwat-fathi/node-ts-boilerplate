import { Schema } from "mongoose";
import { Subscription } from "types/db/index";

export const subscriptionSchema = new Schema<Subscription>({
  name: {
    type: String,
    enum: {
      values: ["basic", "silver", "gold"],
      message: "{VALUE} is not supported",
    },
    default: "basic",
  },
});
