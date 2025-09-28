import mongoose, { Schema, Model } from 'mongoose';
import { INotification } from '../types/notification';

const notificationSchema = new mongoose.Schema<INotification>(
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

const Notification: Model<INotification> =
  mongoose.models.Notifications ||
  mongoose.model<INotification>('Notifications', notificationSchema);

export default Notification;
