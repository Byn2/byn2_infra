import { Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  sender_id: Types.ObjectId;
  recipient_id: Types.ObjectId;
  amount: number;
  note: string;
  reference: string;
  type: 'debit' | 'credit';
  status: 'pending' | 'success' | 'failed';
  currency_id: Types.ObjectId;
}
