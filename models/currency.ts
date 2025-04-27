//@ts-check
import mongoose from 'mongoose';

const currencySchema = new mongoose.Schema({
  code: { type: String, default: 'SLL' },
  name: { type: String, default: 'Leone' },
  symbol: { type: String, default: 'Le' },
});


export default mongoose.models.Currency || mongoose.model('Currency', currencySchema);
