import { Document, Types } from 'mongoose';

export interface ILPUsageLog extends Document {
  lp_id: Types.ObjectId;
  type: 'incoming' | 'used' | 'payout';
  related_user_id?: Types.ObjectId;
  amount: number;
  currency: 'LE' | 'USDC';
  note?: string;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}
