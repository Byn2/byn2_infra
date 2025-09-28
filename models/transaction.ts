import mongoose, { Schema } from "mongoose";

const OtpVerificationSchema = new Schema({
  code: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  verified: { type: Boolean, default: false },
});

const TransactionSchema = new Schema(
  {
    // Transaction parties (either individuals or businesses)
    from_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required"],
    },
    to_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // Core financials
    amount: { type: Number, required: true },
    fee: {
      amount: {
        type: String,
        default: '0',
      },
      currency: {
        type: String,
        default: 'USD',
      },
    },
    currency: { type: String, default: "USD" },

    // Transaction intent
    type: {
      type: String,
      enum: [
        "deposit",
        "withdraw",
        "transfer",
        "payment",
        "staking",
        "unstaking",
        "reward",
        "crypto",
        "direct_transfer",
        "direct_withdraw",
        "direct_deposit",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "success",
        "completed",
        "failed",
        "refunded",
        "cancelled",
        "expired",
        "initialized",
      ],
      default: "pending",
    },

    // Contextual and technical metadata
    reason: { type: String },
    reference: { type: String },
    ussd: { type: String, default: "" },
    receiving_number: { type: String, default: "" },

    source: { type: String }, // e.g. "web", "app", "POS", "whatsapp"
    provider: {
      type: String,
      enum: ["monime", "stripe", "byn2", "crypto"],
      default: "byn2",
    },
    paymentMethod: {
      type: String,
      enum: ["wallet", "bank", "crypto"],
      default: "wallet",
    },
    platform: {
      type: String,
      enum: ["web", "mobile", "whatsapp",],
      default: "web",
    },
    // Exchange data (if cross-currency)
    exchange_rate: {
      from: { currency: String, amount: String },
      to: { currency: String, amount: String },
    },
    amount_received: { type: Number },
    received_currency: { type: String },

    // Optional metadata and verification
    metadata: { type: Schema.Types.Mixed },
    otpVerification: { type: OtpVerificationSchema },

    // Webhook
    webhookSent: { type: Boolean, default: false },
    webhookResponse: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
