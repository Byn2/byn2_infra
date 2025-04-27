import mongoose, { Schema, Document } from 'mongoose';

export interface InvoiceItemDocument extends Document {
  invoiceId: mongoose.Types.ObjectId;
  description: string;
  price: number;
  quantity: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema({
  invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export default mongoose.models.InvoiceItem || mongoose.model('InvoiceItem', InvoiceItemSchema);