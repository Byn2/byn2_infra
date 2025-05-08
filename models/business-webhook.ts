//@ts-check
import mongoose from "mongoose";

const businessWebhookSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Business ID is required"],
    },
    active: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      required: [true, "Url is required"],
      unique: true,
    },
    secret: {
      type: String,
      required: [true, "Secret is required"],
    },
    events: {
      type: [
        {
          type: String,
        },
      ],
      required: [true, "Events is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.BusinessWebhook ||
  mongoose.model("BusinessWebhook", businessWebhookSchema);
