import { Document, Types } from 'mongoose';

export interface IContact extends Document {
  user_id: Types.ObjectId;
  contact_id: Types.ObjectId;
}
