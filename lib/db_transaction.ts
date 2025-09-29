//@ts-nocheck
import mongoose from 'mongoose';
import { ensureConnection } from './db';

export async function startTransaction() {
  try {
    // Ensure connection with retry logic
    await ensureConnection(3);
    
    // Verify connection is actually ready
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection not ready for transaction');
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  } catch (error) {
    console.error('Failed to start transaction:', error);
    throw error;
  }
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
