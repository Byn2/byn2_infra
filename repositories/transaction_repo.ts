//@ts-check
import Transaction from '../models/transaction';

const populate_data = [
  {
    path: 'from_id to_id',
    select: {
      name: 1,
      mobile_number: 1,
      tag: 1,
      image: 1,
      fcm_token: 1,
      currency_id: 1,
    },
    populate: {
      path: 'currency_id',
      select: 'code name symbol',
    },
  },
];

export async function fetchAlltransactions() {
  const transactions = await Transaction.find();
  return transactions;
}

/**
 * Retrieves all transactions where the given user ID is the sender.
 *
 * @param {string} id - The ID of the user to fetch transactions for.
 * @returns {Promise<Transaction[]>} - The list of transactions.
 */
export async function fetchByFromID(id: string) {
  const transactions = await Transaction.find({ from_id: id });

  return transactions;
}

/**
 * Retrieves transactions where the given user ID is either the sender or the recipient.
 *
 * @param {string} id - The ID of the user to fetch transactions for.
 * @param {number} limit - The maximum number of transactions to retrieve.
 * @returns {Promise<Transaction[]>} - A promise that resolves to the list of transactions.
 */

export async function fetchByFromIdAndToId(id: string, limit: number) {
  const transactions = await Transaction.find({
    $or: [{ from_id: id }, { to_id: id }],
  })
    .populate({
      path: 'from_id to_id',
      select: {
        name: 1,
        mobile_number: 1,
        tag: 1,
        image: 1,
        fcm_token: 1,
        currency_id: 1,
      },
      populate: {
        path: 'currency_id',
        select: 'code name symbol',
      },
    })
    .select(
      'id amount currency status reason type ussd provider fee exchange_rate amount_received received_currency createdAt'
    )
    .sort({ createdAt: -1 })
    .limit(limit);

  return transactions;
}

export async function fetchByID(id: string) {
  const transaction = await Transaction.findById(id)
    .populate({
      path: 'from_id to_id',
      select: {
        name: 1,
        mobile_number: 1,
        tag: 1,
        image: 1,
        fcm_token: 1,
        currency_id: 1,
      },
      populate: {
        path: 'currency_id',
        select: 'code name symbol',
      },
    })
    .select(
      'id amount currency status reason type ussd provider fee exchange_rate amount_received received_currency createdAt'
    );
  return transaction;
}

export async function fetchuserTransactionsByStartDateAndEndDate(
  id: string,
  startDate,
  endDate
) {
  const transactions = await Transaction.find({
    createdAt: { $gte: startDate, $lte: endDate },
    $or: [{ from_id: id }, { to_id: id }],
  })
    .populate({
      path: 'from_id to_id',
      select: {
        name: 1,
        mobile_number: 1,
        tag: 1,
        image: 1,
        fcm_token: 1,
        currency_id: 1,
      },
      populate: {
        path: 'currency_id',
        select: 'code name symbol',
      },
    })
    .select(
      'id amount currency status reason type ussd provider fee exchange_rate amount_received received_currency createdAt'
    );

  return transactions;
}

/**
 * Stores a transaction in the database.
 *
 * @param {Object} data - The transaction data to be stored.
 * @param {Object} [options={}] - Options for the save operation.
 * @returns {Promise<Transaction>} - The saved transaction document.
 */
export async function storeTransations(data, options = {}) {
  try{
    const transaction = new Transaction(data);
  await transaction.save(options);
  await transaction.populate([
    {
      path: 'from_id to_id',
      select: {
        name: 1,
        mobile_number: 1,
        tag: 1,
        image: 1,
        fcm_token: 1,
        currency_id: 1,
      },
      populate: {
        path: 'currency_id',
        select: 'code name symbol',
      },
    },
  ]);
  return transaction;
  }catch(error){
    console.log(error);
  }
}

export async function updateTransaction(id: string, data, options = {}) {
  const transaction = await Transaction.findByIdAndUpdate(id, data, {
    new: true,
    ...options,
  });
  return transaction;
}
