//@ts-check
import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    id_type: {
      type: String,
      required: [true, 'ID type is required'],
      enum: ['passport', 'national_id', 'drivers_license'],
    },
    id_number: {
      type: String,
      required: [true, 'ID number is required'],
      unique: true,
    },
    id_front_image: {
      type: String,
      required: [true, 'Front image of ID is required'],
    },
    id_back_image: {
      type: String,
      required: [true, 'Back image of ID is required'],
    },
    selfie_image: {
      type: String,
      required: [true, 'Selfie image is required'],
    },
    address_proof_type: {
      type: String,
      required: [true, 'Address proof type is required'],
      enum: ['utility_bill', 'bank_statement', 'rental_agreement'],
    },
    address_proof_image: {
      type: String,
      required: [true, 'Address proof image is required'],
    },
    address: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, required: [true, 'State is required'] },
      country: { type: String, required: [true, 'Country is required'] },
      postal_code: {
        type: String,
        required: [true, 'Postal code is required'],
      },
    },
    date_of_birth: {
      type: Date,
      required: [true, 'Date of birth is required'],
    },
    verification_status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejection_reason: {
      type: String,
      default: '',
    },
    verified_at: {
      type: Date,
      default: null,
    },
    verified_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

// Create indexes for frequently queried fields
kycSchema.index({ verification_status: 1 });
kycSchema.index({ id_number: 1 });

export default mongoose.model('KYC', kycSchema);
