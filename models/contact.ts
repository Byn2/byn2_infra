//@ts-check
import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    contact_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Contact ID is required'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
