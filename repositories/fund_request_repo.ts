import FundRequest from '../models/fundRequest';
import { IFundRequest } from '../types/fundRequest';

const projection = {
  name: 1,
  mobile_number: 1,
  email: 1,
  tag: 1,
  image: 1,
  fcm_token: 1,
  currency_id: 1,
};

/**
 * Fetch all fund requests that involve a given user (either sender or recipient).
 *
 * @param {string} id - The ID of the user to fetch requests for.
 * @returns {Promise<IFundRequest[]>} - The list of fund requests.
 */
export async function fetchByFromIDOrToID(id: string): Promise<IFundRequest[]> {
  const fundRequests = await FundRequest.find({
    $or: [{ from_id: id }, { to_id: id }],
  })
    .sort({ createdAt: -1 })
    .populate({
      path: 'from_id',
      select: projection,
      populate: {
        path: 'currency_id',
        select: { code: 1, name: 1, symbol: 1 },
      },
    })
    .populate({
      path: 'to_id',
      select: projection,
      populate: {
        path: 'currency_id',
        select: { code: 1, name: 1, symbol: 1 },
      },
    });

  return fundRequests;
}

/**
 * Fetch a fund request by its ID.
 *
 * @param {string} id - The ID of the fund request to fetch.
 * @returns {Promise<IFundRequest | null>} - The fund request if found, or `null` if not.
 */
export async function fetchById(id: string): Promise<IFundRequest | null> {
  const fundRequest = await FundRequest.findById(id)
    .populate({ path: 'from_id', select: projection })
    .populate({ path: 'to_id', select: projection });

  return fundRequest;
}

/**
 * Store a fund request in the database.
 *
 * @param {object} data - The data for the fund request to store.
 * @param {object} [options={}] - Optional settings for storing the fund request.
 * @returns {Promise<void>} - A promise that resolves when the fund request has been stored.
 */
export async function storeFundRequest(data: any, options = {}) {
  const fundRequest = new FundRequest(data);
  await fundRequest.save(options);
}

/**
 * Update a fund request in the database.
 *
 * @param {string} id - The ID of the fund request to update.
 * @param {object} data - The data to update the fund request with.
 * @param {object} [options={}] - Optional settings for updating the fund request.
 * @returns {Promise<IFundRequest | null>} - A promise that resolves to the updated fund request.
 */
export async function updateFundRequest(
  id: string,
  data: any,
  options = {}
): Promise<IFundRequest | null> {
  const fundRequest = await FundRequest.findByIdAndUpdate(id, data, {
    new: true,
    ...options,
  });
  return fundRequest;
}
