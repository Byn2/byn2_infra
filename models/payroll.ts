import mongoose, { Schema, Document, Model } from 'mongoose';

// Payroll interface
export interface IPayroll extends Document {
  id: string;
  name: string;
  status: 'Draft' | 'Scheduled' | 'Processing' | 'Completed';
  payrollType: 'Regular' | 'Bonus' | 'Commission' | 'Contractor';
  paymentDate: Date;
  payPeriod: {
    startDate: Date;
    endDate: Date;
  };
  recurring: {
    isRecurring: boolean;
    frequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly';
  };
  employeeCount: number;
  totalAmount: number;
  currency: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
}

// Payroll schema
const PayrollSchema: Schema = new Schema({
  business_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Business ID is required'],
  },
  name: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Scheduled', 'Processing', 'Completed'],
    default: 'Draft'
  },
  payrollType: { 
    type: String, 
    enum: ['regular', 'bonus', 'commission', 'contractor'],
    default: 'Regular'
  },
  paymentDate: { type: Date, required: true },
  payPeriod: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: { 
      type: String, 
      enum: ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'],
      default: 'Monthly'
    }
  },
  employeeCount: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  currency: { type: String, default: '$' },
  notes: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the model
const Payroll: Model<IPayroll> = mongoose.models.Payroll || mongoose.model<IPayroll>('Payroll', PayrollSchema);

export default Payroll;