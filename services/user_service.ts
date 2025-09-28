//@ts-nocheck
//@ts-ignore
import * as userRepo from '../repositories/user_repo';
import * as walletService from './wallet_service';
import bcrypt from 'bcrypt';
import path from 'path';
// import { deleteImage } from '../utils/aws-s3.js';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import {connectDB} from '../lib/db'


const cluster = process.env.CONNECTION_URL || 'devnet';

const connection = new Connection(clusterApiUrl(cluster), 'confirmed');
export async function fetchAllUsers() {
  await connectDB();
  const users = await userRepo.fetchAllUsers();
  return users;
}

export async function fetchUserById(id) {
  await connectDB();

  const user = await userRepo.findUserById(id);

  if (!user) {
    return { success: false, message: 'User not found' };
  }

  return user;
}

export async function fetchUserByMobile(mobile) {
  await connectDB();
  const user = await userRepo.findUserByMobile(mobile);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  return user;
}

export async function fetchUserByMobileBot(mobile) {
  await connectDB();
  const user = await userRepo.findUserByMobile(mobile);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  return {
    success: true,
    data: user
  };
  
}

export async function fetchUserByTagOrMobile(identifier: any) {
  await connectDB();
  const user = await userRepo.findUserByTagOrMobile(identifier);
  if (!user) {
    return null;
  }
  return user;
}

export async function fetchUserByTag(tag: any) {
  await connectDB();
  const user = await userRepo.findUserByTag(tag);
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  return user;
}

export async function checkTags(tag) {
  await connectDB();
  const user = await userRepo.checkTag(tag);
  return !user;
}

export async function storeUser(data, session) {
  await connectDB();
  const user = await userRepo.storeUser(data, session);
  return user;
}

export async function updateUser(id, data, session) {
  await connectDB();
  const user = await userRepo.updateUser(id, data, session);
  return user;
}

export async function updatePassword(user, data, session) {
  await connectDB();
  if (data.password !== data.password_confirmation) {
    return { success: false, message: 'Passwords do not match' };
  }

  //Correctly compare the hashed password
  const isMatch = await bcrypt.compare(data.current_password, user.password);
  if (!isMatch) {
    return { success: false, message: 'Current password is incorrect' };
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  //Prevent users from using the same password again
  const isSameAsCurrent = await bcrypt.compare(data.password, user.password);
  if (isSameAsCurrent) {
    return {
      success: false,
      message: 'New password cannot be the same as the current password',
    };
  }

  // Update the user's password in the database
  const updatedUser = await userRepo.updateUser(
    user._id,
    { password: hashedPassword },
    { session }
  );

  return { success: true, message: 'Password has been changed' };
}

export async function searchUser(user, term, limit) {
  term = typeof term === 'string' ? term : '';
  limit = parseInt(limit, 10) || 10;

  const query = {
    _id: { $ne: user._id }, // Exclude the authenticated user
    $or: [
      { name: { $regex: term, $options: 'i' } }, // Case-insensitive search for name
      { tag: { $regex: term, $options: 'i' } }, // Case-insensitive search for tag
      { mobile_number: { $regex: term, $options: 'i' } },
    ],
  };

  const users = await userRepo.searchUsersByQuery(query, limit);

  return users;
}

export async function updateFcmToken(user, data, session) {
  return await userRepo.updateUser(
    user._id,
    { fcm_token: data.fcm_token },
    { session }
  );
}

export async function uploadImage(user, filePath, session) {
  const newPath = filePath;

  if (user.image) {
    const oldImageName = path.basename(user.image);

    await deleteImage(`profile/${oldImageName}`);
  }

  await userRepo.updateUser(user._id, { image: newPath }, { session });
}

export async function passwordChecker(user, body) {
  const { pwd } = body;

  const isMatch = await bcrypt.compare(pwd, user.password);
  if (isMatch) {
    return { success: true, message: 'Password is correct' };
  } else {
    return { success: false, message: 'Password is incorrect' };
  }
}

export async function accountRemoveCheck(user, body) {
  const deletionChecks = {
    'No pending transactions or disputes': true,
    'Account balance is zero': true,
    'No active subscriptions or loans': true,
    'No ongoing investigations': true,
  };

  // Check wallet balance
  const wallet = await walletService.getWalletBalance(user);
  if (wallet.balance > 0) {
    deletionChecks['Account balance is zero'] = false;
  }

  // Check for pending transactions
  // const hasPendingTxns = await transactionService.hasPendingTransactions(user.id);
  // if (hasPendingTxns) {
  //   deletionChecks['No pending transactions or disputes'] = false;
  // }

  // Check for active subscriptions or loans

  // Check if user is under investigation (example flag in DB)

  // Determine if all checks passed
  const canDelete = Object.values(deletionChecks).every((v) => v === true);

  return {
    success: canDelete,
    deletionChecks,
    message: canDelete
      ? 'Account can be deleted'
      : 'Account cannot be deleted. See failed checks.',
  };
}

export async function removeAccount(user, body, session) {
  

  const result = await accountRemoveCheck(user, body, session);
  if (!result.success) {
    return { success: false, message: result.message };
  }

  const deletionGracePeriodDays = 30;
  const now = new Date();

  await userRepo.updateUser(user._id,{
    account_deletion_requested: true,
    deletion_requested_at: now,
    deletion_scheduled_at: new Date(now.getTime() + deletionGracePeriodDays * 24 * 60 * 60 * 1000),
  }, session);

  return {
    success: true,
    message: `Account deletion has been requested. Your account will be deleted after ${deletionGracePeriodDays} days.`,
  };

}
