import mongoose from 'mongoose';

const liquidityProviderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tier: {
      type: String,
      enum: ['basic', 'crypto', 'pro'],
      required: true,
    },

    currency: {
      type: String,
      enum: ['LE', 'USDC'],
      required: true,
    },

    amount_provided: {
      type: Number,
      required: true,
    },

    amount_in_use: {
      type: Number,
      default: 0,
    },

    monthly_interest_rate: {
      type: Number,
      required: true,
    },

    duration_days: {
      type: Number,
      required: true,
    },

    date_staked: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },

    maturity_date: {
      type: Date,
      default: function () {
        return new Date(Date.now() + this.duration_days * 24 * 60 * 60 * 1000);
      },
    },
  },
  { timestamps: true }
);


export default mongoose.models.LiquidityProvider || mongoose.model('LiquidityProvider', liquidityProviderSchema);
