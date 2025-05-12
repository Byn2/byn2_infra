//@ts-nocheck
//@ts-ignore
import KYC from '../models/kyc';
import { Types } from 'mongoose';

const projection = {
  user_id: 1,
  id_type: 1,
  id_number: 1,
  id_front_image: 1,
  id_back_image: 1,
  selfie_image: 1,
  address_proof_type: 1,
  address_proof_image: 1,
  address: 1,
  date_of_birth: 1,
  verification_status: 1,
  rejection_reason: 1,
  verified_at: 1,
  verified_by: 1,
};

/**
 * Creates a new KYC record in the database.
 *
 * @param {Object} data - The KYC data to be stored.
 * @param {Object} [options={}] - Optional settings for the save operation.
 * @returns {Promise<KYC>} - The created KYC document.
 */
export async function storeKYC(data: any, options = {}) {
  const kyc = new KYC(data);
  return await kyc.save(options);
}

/**
 * Retrieves a KYC record by its ID.
 *
 * @param {string} id - The ID of the KYC record to fetch.
 * @returns {Promise<KYC | null>} - The KYC document if found, or null if not.
 */
export async function findKYCById(id: string) {
  return await KYC.findById(id)
    .select(projection)
    .populate('user_id', 'name tag mobile_number');
}

/**
 * Retrieves a KYC record by user ID.
 *
 * @param {string} userId - The user ID to search for.
 * @returns {Promise<KYC | null>} - The KYC document if found, or null if not.
 */
export async function findKYCByUserId(userId: string) {
  return await KYC.findOne({ user_id: new Types.ObjectId(userId) })
    .select(projection)
    .populate('user_id', 'name tag mobile_number');
}

/**
 * Checks if an ID number already exists in the system.
 *
 * @param {string} idNumber - The ID number to check.
 * @returns {Promise<KYC | null>} - The KYC document if found, or null if not.
 */
export async function findKYCByIdNumber(idNumber: string) {
  return await KYC.findOne({ id_number: idNumber }).select(projection);
}

/**
 * Updates a KYC record in the database.
 *
 * @param {string} id - The ID of the KYC record to update.
 * @param {Object} data - The data to update the KYC record with.
 * @param {Object} [options={}] - Optional settings for updating the KYC record.
 * @returns {Promise<KYC | null>} - The updated KYC document if found, or null if not.
 */
export async function updateKYC(id: string, data: any, options = {}) {
  return await KYC.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    ...options,
  }).select(projection);
}

/**
 * Updates the verification status of a KYC record.
 *
 * @param {string} id - The ID of the KYC record.
 * @param {string} status - The new verification status.
 * @param {string} [verifiedBy] - The ID of the admin who verified the KYC.
 * @param {string} [rejectionReason] - The reason for rejection if status is 'rejected'.
 * @param {Object} [options={}] - Optional settings for the update operation.
 * @returns {Promise<KYC | null>} - The updated KYC document if found, or null if not.
 */
export async function updateVerificationStatus(
  id,
  status,
  verifiedBy,
  rejectionReason,
  options = {}
) {
  const updateData = {
    verification_status: status,
    verified_at: status === 'approved' ? new Date() : null,
    verified_by: verifiedBy ? new Types.ObjectId(verifiedBy) : null,
    rejection_reason: rejectionReason || '',
  };

  return await KYC.findByIdAndUpdate(id, updateData, {
    new: true,
    ...options,
  }).select(projection);
}

/**
 * Retrieves all pending KYC verifications.
 *
 * @returns {Promise<KYC[]>} - Array of pending KYC documents.
 */
export async function findPendingVerifications() {
  return await KYC.find({ verification_status: 'pending' })
    .select(projection)
    .populate('user_id', 'name tag mobile_number')
    .sort({ createdAt: 1 });
}
