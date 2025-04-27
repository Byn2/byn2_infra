import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  image: string;
  name: string;
  tag: string;
  mobile_number: string;
  password: string;
  currency_id: Types.ObjectId;
  mobile_verified_at: Date | string;
  mobile_verify_code: number;
  mobile_attempts_left: number;
  mobile_last_attempt_date: Date | string;
  mobile_verify_code_sent_at: Date | string;
  mobile_kyc_verified_at: Date | string;
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
  isValidPassword(password: string): Promise<boolean>;
}
