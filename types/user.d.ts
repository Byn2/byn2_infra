import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  image: string;
  name: string;
  tag: string;
  mobile_number: string;
  password: string;
  auth_provider: 'local' | 'custom' | 'google' | 'facebook';
  currency_id: Types.ObjectId;
  mobile_verified_at: Date | null;
  mobile_verify_code: number;
  mobile_attempts_left: number;
  mobile_last_attempt_date: Date | null;
  mobile_verify_code_sent_at: Date | null;
  mobile_kyc_verified_at: Date | null;
  rememberToken: string | null;
  fcm_token: string;
  account_deletion_requested: boolean;
  deletion_requested_at: Date | null;
  deletion_scheduled_at: Date | null;
  deletion_completed_at: Date | null;
  under_investigation: boolean;
  is_business: boolean;
  business_verified_at: Date | null;
  business_category: string;
  business_description: string;
  business_website: string;
  accepts_payments: boolean;
  default_payment_note: string;
  bot_token: string;
  bot_session: string;
  createdAt: Date;
  updatedAt: Date;
  isValidPassword(password: string): Promise<boolean>;
}
