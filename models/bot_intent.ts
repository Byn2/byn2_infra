//@ts-check
import mongoose from 'mongoose';

const botIntentSchema = new mongoose.Schema(
  {
    bot_session: {
      type: String,
      required: [true, 'Bot Session is required'],
      unique: true,
    },
    intent: {
      type: String,
      enum: ['deposit', 'transfer', 'withdraw', 'check_balance', 'start', 'welcome_pending', 'recipient_pending', 'congratulation_sent'],
      default: 'start',
    },
    intent_option: {
      type: String,
      enum: ['mobile_money', 'crypto', 'bank_transfer'],
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    payer: {
      type: String,
      enum: ['self', 'different_number'],
      default: null,
    },
    currency: {
      type: String,
      enum: ['local', 'usd'],
      default: null,
    },
    number: {
      type: String,
      default: null,
    },
    step: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'success', 'cancel'],
      default: 'pending',
    },
    ussd: {
      type: String,
      default: ""
    },
    // Additional fields for welcome and recipient flows
    mobile_number: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    // Fields for recipient onboarding
    received_amount: {
      type: Number,
      default: null,
    },
    received_currency: {
      type: String,
      default: null,
    },
    sender_name: {
      type: String,
      default: null,
    },
    // Dynamic fields used for operation restoration
    pending_operation: {
      type: String,
      default: null,
    },
    original_step: {
      type: Number,
      default: null,
    },
    ussd_code: {
      type: String,
      default: null,
    },
    depositing_number: {
      type: String,
      default: null,
    }
  },
  { timestamps: true }
);

export default mongoose.models.BotIntent || mongoose.model('BotIntent', botIntentSchema);
