import mongoose, { Schema, Document } from 'mongoose';

export interface InvoiceDocument extends Document {
  invoiceNumber: string;
  companyName: string;
  recipientEmail: string;
  recipientDetails: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  description: string;
  issuedDate: Date;
  dueDate: Date;
  status: string;
  amount: {
    subtotal: number;
    tax: number;
    total: number;
  };
  currency: string;
  installments: {
    count: number;
    isRecurring: boolean;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  companyName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  recipientDetails: {
    name: { type: String, required: true },
    address: { type: String },
    email: { type: String, required: true },
    phone: { type: String }
  },
  description: { type: String },
  issuedDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Completed', 'Overdue', 'Processing', 'Requested', 'Unpaid'],
    default: 'Requested'
  },
  amount: {
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  currency: { type: String, default: '$' },
  installments: {
    count: { type: Number, default: 1 },
    isRecurring: { type: Boolean, default: false }
  },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

// Pre-save hook to generate invoice number if not provided
InvoiceSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    this.invoiceNumber = `#${(123456 + count).toString().padStart(6, '0')}`;
  }
  next();
});

export default mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);