import mongoose from 'mongoose';

const InvoiceCounterScheme = new mongoose.Schema({
  _id: { type: String, required: true,  },
  sequence_value: { type: Number, default: 1000 },
});



export default mongoose.models.InvoiceCounter || mongoose.model('InvoiceCounter', InvoiceCounterScheme);
