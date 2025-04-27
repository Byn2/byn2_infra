//@ts-check
import mongoose from 'mongoose';

const fundRequestSchema = new mongoose.Schema(
  {
    from_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'From ID is required'],
    },
    to_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'To ID is required'],
    },
    amount: {
      type: String,
      required: [true, 'Amount is required'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    base_currency: {
      type: String,
      required: [true, 'Base currency is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);


export default mongoose.models.FundRequest || mongoose.model('FundRequest', fundRequestSchema);
