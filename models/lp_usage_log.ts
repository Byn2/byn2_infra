
import mongoose from 'mongoose';

const lpUsageLogSchema = new mongoose.Schema({
  lp_id: { type: mongoose.Schema.Types.ObjectId, ref: 'LiquidityProvider', required: true },

  type: {
    type: String,
    enum: ['incoming', 'used', 'payout'],
    required: true
  },

  related_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  amount: { type: Number, required: true },

  currency: {
    type: String,
    enum: ['LE', 'USDC'],
    required: true
  },

  note: { type: String },

  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

//export default mongoose.models.User || mongoose.model('User', userSchema);
export default mongoose.models.LPUsageLog || mongoose.model('LPUsageLog', lpUsageLogSchema);
