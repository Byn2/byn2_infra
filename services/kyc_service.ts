// //@ts-check
// import * as kycRepo from '../repositories/kyc_repo';
// import { AppError } from '../utils/app_error.js';
// import { uploadToS3, deleteImage } from '../utils/aws-s3.js';
// import path from 'path';

// /**
//  * Submit a new KYC verification request
//  */
// export async function submitKYC(
//   userId: string,
//   kycData: any,
//   files: any,
//   session?: any
// ) {
//   // Check if KYC already exists for user
//   const existingKYC = await kycRepo.findKYCByUserId(userId);
//   if (existingKYC) {
//     throw new AppError('KYC verification already submitted for this user', 400);
//   }

//   // Check for duplicate ID number
//   const duplicateID = await kycRepo.findKYCByIdNumber(kycData.id_number);
//   if (duplicateID) {
//     throw new AppError('ID number already exists in the system', 400);
//   }

//   // Upload images to S3
//   const uploadPromises = [];
//   const fileFields = [
//     'id_front_image',
//     'id_back_image',
//     'selfie_image',
//     'address_proof_image',
//   ];

//   for (const field of fileFields) {
//     if (files[field]) {
//       uploadPromises.push(uploadToS3.single(field)(files[field]));
//     }
//   }

//   const uploadedFiles = await Promise.all(uploadPromises);

//   // Prepare KYC data with uploaded file URLs
//   const kycPayload = {
//     ...kycData,
//     user_id: userId,
//     id_front_image: uploadedFiles[0]?.location,
//     id_back_image: uploadedFiles[1]?.location,
//     selfie_image: uploadedFiles[2]?.location,
//     address_proof_image: uploadedFiles[3]?.location,
//   };

//   return await kycRepo.storeKYC(kycPayload, { session });
// }

// /**
//  * Get KYC status for a user
//  */
// export async function getKYCStatus(userId: string) {
//   const kyc = await kycRepo.findKYCByUserId(userId);
//   if (!kyc) {
//     throw new AppError('KYC record not found', 404);
//   }
//   return kyc;
// }

// /**
//  * Verify a KYC submission
//  */
// export async function verifyKYC(
//   kycId: string,
//   status: 'pending' | 'approved' | 'rejected',
//   adminId: string,
//   rejectionReason?: string,
//   session?: any
// ) {
//   const kyc = await kycRepo.findKYCById(kycId);
//   if (!kyc) {
//     throw new AppError('KYC record not found', 404);
//   }

//   if (kyc.verification_status !== 'pending') {
//     throw new AppError('KYC verification already processed', 400);
//   }

//   if (status === 'rejected' && !rejectionReason) {
//     throw new AppError('Rejection reason is required', 400);
//   }

//   return await kycRepo.updateVerificationStatus(
//     kycId,
//     status,
//     adminId,
//     rejectionReason,
//     { session }
//   );
// }

// /**
//  * Get all pending KYC verifications
//  */
// export async function getPendingVerifications() {
//   return await kycRepo.findPendingVerifications();
// }

// /**
//  * Update an existing KYC submission
//  */
// export async function updateKYC(
//   userId: string,
//   kycId: string,
//   updateData: any,
//   files?: any,
//   session?: any
// ) {
//   const kyc = await kycRepo.findKYCById(kycId);
//   if (!kyc) {
//     throw new AppError('KYC record not found', 404);
//   }

//   if (kyc.user_id.toString() !== userId) {
//     throw new AppError('Unauthorized to update this KYC', 403);
//   }

//   if (kyc.verification_status !== 'pending') {
//     throw new AppError('Cannot update KYC after verification', 400);
//   }

//   // Handle file uploads if any
//   if (files) {
//     const uploadPromises = [];
//     const fileFields = [
//       'id_front_image',
//       'id_back_image',
//       'selfie_image',
//       'address_proof_image',
//     ];

//     for (const field of fileFields) {
//       if (files[field]) {
//         // Delete old file if it exists
//         if (kyc[field]) {
//           const oldFileName = path.basename(kyc[field]);
//           await deleteImage(`kyc/${userId}/${oldFileName}`);
//         }

//         // Upload new file
//         uploadPromises.push(uploadToS3.single(field)(files[field]));
//       }
//     }

//     const uploadedFiles = await Promise.all(uploadPromises);

//     // Update the data with new file URLs
//     fileFields.forEach((field, index) => {
//       if (uploadedFiles[index]) {
//         updateData[field] = uploadedFiles[index].location;
//       }
//     });
//   }

//   return await kycRepo.updateKYC(kycId, updateData, { session });
// }
