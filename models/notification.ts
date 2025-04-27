//@ts-check
import mongoose, { Schema } from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    notifiable: {
      type: {
        type: String,
        required: [true, 'Notifiable type is required'],
      },
      id: {
        type: Schema.Types.ObjectId,
        required: [true, 'Notifiable ID is required'],
        refPath: 'notifiable.type',
      },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Notifications || mongoose.model('Notifications', notificationSchema);
