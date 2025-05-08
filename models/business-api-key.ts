//@ts-check
import mongoose from 'mongoose';

const businessApiKeySchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Business ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    key: {
      type: String,
      required: [true, 'Key is required'],
      unique: true,
    },
    active:{
      type: Boolean,
      default: true
    },
    lastUsed: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.models.BusinessApiKey || mongoose.model('BusinessApiKey', businessApiKeySchema);
