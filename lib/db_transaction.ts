//@ts-nocheck
import mongoose from 'mongoose';
import { ensureConnection } from './db';

export async function startTransaction() {
  // Ensure connection before creating session
  await ensureConnection();
  const session = await mongoose.startSession();
  session.startTransaction();
  return session;
}

// Function to commit a transaction
export async function commitTransaction(session) {
  try {
    await session.commitTransaction();
  } catch (error) {
    console.error('Transaction commit error:', error);
    throw error;
  } finally {
    session.endSession();
  }
}

// Function to abort a transaction
export async function abortTransaction(session) {
  try {
    await session.abortTransaction();
  } catch (error) {
    console.error('Transaction abort error:', error);
  } finally {
    session.endSession();
  }
}
