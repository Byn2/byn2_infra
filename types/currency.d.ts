import { Document } from 'mongoose';

export interface ICurrency extends Document {
  name: string;
  slug: string;
  symbol: string;
}
