import mongoose, { Schema, Document, Model } from 'mongoose';

// PayrollEmployee interface
export interface IPayrollEmployee extends Document {
  payrollId: mongoose.Types.ObjectId;
  name: string;
  position: string;
  salary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  status: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: string;
  paymentDetails: {
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// PayrollEmployee schema
const PayrollEmployeeSchema: Schema = new Schema({
  payroll_id: { type: Schema.Types.ObjectId, ref: 'Payroll', required: true },
  name: { type: String, required: true },
  position: { type: String },
  salary: { type: Number, required: true },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  netPay: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  },
  paymentMethod: { 
    type: String, 
    enum: ['Byn2', 'Bank'],
    default: 'Byn2'
  },
  paymentDetails: {
    mobileNumber: { type: String },
    accountName: { type: String },
    accountNumber: { type: String },
    bankName: { type: String },
    routingNumber: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create and export the model
const PayrollEmployee: Model<IPayrollEmployee> = mongoose.models.PayrollEmployee || 
  mongoose.model<IPayrollEmployee>('PayrollEmployee', PayrollEmployeeSchema);

export default PayrollEmployee;