import * as transactionRepo from '../repositories/transaction_repo';

export async function fetchAlltransactions() {
  const transactions = await transactionRepo.fetchAlltransactions();
  return transactions;
}
export async function fetchByFromId(id) {
  const transactions = await transactionRepo.fetchByFromID(id);
  return transactions;
}

export async function fetchByID(id) {
  const transaction = await transactionRepo.fetchByID(id);
  return transaction;
}

export async function fetchByFromIdAndToId(id, limit) {
  const transactions = await transactionRepo.fetchByFromIdAndToId(id, limit);
  return transactions;
}

export async function fetchuserTransactionsByStartDateAndEndDate(id, startDate, endDate) {
  const transactions = await transactionRepo.fetchuserTransactionsByStartDateAndEndDate(id, startDate, endDate);
  return transactions;
}

export async function storeTransations(data, session) {
  
  const transaction = await transactionRepo.storeTransations(data, session);
  return transaction;
}

export async function updateTransaction(id, data, session) {
  const transaction = await transactionRepo.updateTransaction(
    id,
    data,
    session
  );
  return transaction;
}
