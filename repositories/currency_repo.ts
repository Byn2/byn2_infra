// @ts-nocheck
import Currency from "../models/currency";

/**
 * Gets the currency code for a user.
 *
 * @param {Object} user - Mongoose User document
 * @returns {String} The currency code
 * @throws {Object} If the currency is not found
 */
export async function getCurrency(user: any) {
  const currency = await Currency.findOne({ _id: user.currency_id });
  if (!currency) {
    throw { status: 404, message: "Currency not found" };
  }
  return currency.code;
}

/**
 * Stores a currency in the database.
 *
 * @param {Object} data - The currency data to be stored.
 * @param {Object} [options={}] - Options for the save operation.
 * @returns {Promise<Object>} The saved currency document.
 */

export async function storeCurrency(data: any, options = {}) {
  const currency = new Currency(data);
  return await currency.save(options);
}
