//@ts-check
import mongoose, { Schema } from 'mongoose';

const transactionScheme = new mongoose.Schema(
  {
    from_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'From ID is required'],
    },
    to_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    amount: {
      type: String,
      required: [true, 'Amount is required'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
      default: 'USD',
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    status: {
      type: String,
      enum: [
        'pending',
        'completed',
        'failed',
        'processing',
        'cancelled',
        'expired',
      ],
      default: 'pending',
    },
    ussd: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['monime', 'stripe', 'byn2', 'crypto'],
      default: 'byn2',
    },
    type: {
      type: String,
      enum: ['deposit', 'withdraw', 'transfer', 'crypto', 'direct_transfer', 'direct_withdraw', 'direct_deposit'],
      required: [true, 'Transaction type is required'],
    },
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
    exchange_rate: {
      from: {
        currency: String,
        amount: String,
      },
      to: {
        currency: String,
        amount: String,
      },
    },
    amount_received: {
      type: String,
    },
    received_currency: {
      type: String,
    },
    receiving_number: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);
//export default mongoose.models.Currency || mongoose.model('Currency', currencySchema);
export default mongoose.models.Transaction || mongoose.model('Transaction', transactionScheme);
