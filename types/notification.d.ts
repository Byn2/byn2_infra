import { Document, Types } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  notifiable: {
    type: string;
    id: Types.ObjectId;
  };
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
