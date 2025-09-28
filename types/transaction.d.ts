import { Document, Types } from 'mongoose';
import { IUser } from './user';

export interface ITransaction extends Document {
  from_id: Types.ObjectId | IUser;
  to_id?: Types.ObjectId | IUser;
  amount: number;
  fee: {
    amount: string;
    currency: string;
  };
  currency: string;
  type:
    | 'deposit'
    | 'withdraw'
    | 'transfer'
    | 'payment'
    | 'staking'
    | 'unstaking'
    | 'reward'
    | 'crypto'
    | 'direct_transfer'
    | 'direct_withdraw'
    | 'direct_deposit';
  status:
    | 'pending'
    | 'processing'
    | 'success'
    | 'completed'
    | 'failed'
    | 'refunded'
    | 'cancelled'
    | 'expired'
    | 'initialized';
  reason?: string;
  reference?: string;
  ussd: string;
  receiving_number: string;
  source?: string;
  provider: 'monime' | 'stripe' | 'byn2' | 'crypto';
  paymentMethod: 'wallet' | 'bank' | 'crypto';
  platform: 'web' | 'mobile' | 'whatsapp';
  exchange_rate?: {
    from: { currency: string; amount: string };
    to: { currency: string; amount: string };
  };
  amount_received?: number;
  received_currency?: string;
  metadata?: any;
  otpVerification?: {
    code: string;
    expiresAt: Date;
    attempts: number;
    verified: boolean;
  };
  webhookSent: boolean;
  webhookResponse?: string;
  createdAt: Date;
  updatedAt: Date;
}
