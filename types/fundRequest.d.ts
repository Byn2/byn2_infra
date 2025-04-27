import { Document, Types } from 'mongoose';

export interface IFundRequest extends Document {
  from_id: Types.ObjectId;
  to_id: Types.ObjectId;
  amount: string;
  reason: string;
  base_currency: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
