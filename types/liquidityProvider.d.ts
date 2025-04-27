import { Document, Types } from 'mongoose';

export interface ILiquidityProvider extends Document {
  user_id: Types.ObjectId;
  tier: 'basic' | 'crypto' | 'pro';
  currency: 'LE' | 'USDC';
  amount_provided: number;
  amount_in_use: number;
  monthly_interest_rate: number;
  duration_days: number;
  date_staked: Date;
  status: 'active' | 'completed';
  maturity_date: Date;
  createdAt: Date;
  updatedAt: Date;
}
