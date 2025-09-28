import * as transactionRepo from '../repositories/transaction_repo';
import { ensureConnection } from '../lib/db';

export async function fetchAlltransactions() {
  await ensureConnection();
  const transactions = await transactionRepo.fetchAlltransactions();
  return transactions;
}
export async function fetchByFromId(id: any) {
  await ensureConnection();
  const transactions = await transactionRepo.fetchByFromID(id);
  return transactions;
}

export async function fetchByID(id: any) {
  await ensureConnection();
  const transaction = await transactionRepo.fetchByID(id);
  return transaction;
}

export async function fetchByFromIdAndToId(id: any, limit: any) {
  await ensureConnection();
  const transactions = await transactionRepo.fetchByFromIdAndToId(id, limit);
  return transactions;
}

export async function fetchuserTransactionsByStartDateAndEndDate(id: any, startDate: any, endDate: any) {
  await ensureConnection();
  const transactions = await transactionRepo.fetchuserTransactionsByStartDateAndEndDate(id, startDate, endDate);
  return transactions;
}

export async function storeTransations(data: any, session: any) {
  await ensureConnection();
  const transaction = await transactionRepo.storeTransations(data, session);
  return transaction;
}

export async function updateTransaction(id: any, data: any, session: any) {
  await ensureConnection();
  const transaction = await transactionRepo.updateTransaction(
    id,
    data,
    session
  );
  return transaction;
}
