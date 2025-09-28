import User from '../models/user';
import { IUser } from '../types/user';

const projection = {
  name: 1,
  mobile_number: 1,
  email: 1,
  tag: 1,
  image: 1,
  fcm_token: 1,
  mobile_kyc_verified_at: 1,
  currency_id: 1,
  bot_token: 1,
  bot_session: 1,
};

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<IUser[]>} - The list of users.
 */
export async function fetchAllUsers(): Promise<IUser[]> {
  return await User.find();
}

/**
 * Retrieves a user by its ID.
 *
 * @param {string} id - The ID of the user to fetch.
 * @returns {Promise<IUser | null>} - The user document if found, or `null` if not.
 */
export async function findUserById(id: string): Promise<IUser | null> {
  const user = await User.findById(id).select(projection).populate('currency_id');
  return user;
}

/**
 * Retrieves a user by its mobile number.
 *
 * @param {string} mobile - The mobile number to search for.
 * @returns {Promise<IUser | null>} - The user document if found, or `null` if not.
 */
export async function findUserByMobile(mobile: string | number): Promise<IUser | null> {
  const user = await User.findOne({ mobile_number: mobile })
    .select(projection)
    .populate('currency_id');
  return user;
}

/**
 * Retrieves a user by its tag.
 *
 * @param {string} tag - The tag to search for.
 * @returns {Promise<IUser | null>} - The user document if found, or `null` if not.
 */
export async function findUserByTag(tag: string): Promise<IUser | null> {
  const user = await User.findOne({ tag: tag }).select(projection).populate('currency_id');
  return user;
}

export async function findUserByTagOrMobile(identifier: string): Promise<IUser | null> {
  const user = await User.findOne({
    $or: [{ tag: identifier }, { mobile_number: identifier }],
  })
    .select(projection)
    .populate('currency_id');
  return user;
}

/**
 * Checks if a user with the given tag exists.
 *
 * @param {string} tag - The tag to check.
 * @returns {Promise<IUser | null>} - The user document if found, or `null` if not.
 */
export async function checkTag(tag: string): Promise<IUser | null> {
  const user = await User.findOne({ tag: tag }).select(projection).populate('currency_id');
  return user;
}

/**
 * Retrieves users whose mobile number matches any of the provided phone numbers,
 * excluding the user with the given `authUserId`.
 *
 * @param {string[]} phoneNumbers - The phone numbers to search for.
 * @param {string} authUserId - The ID of the user to exclude from the search.
 * @returns {Promise<IUser[]>} - The list of matching users.
 */
export async function findMatchingUsersByPhoneNumber(
  phoneNumbers: string[],
  authUserId: string
): Promise<IUser[]> {
  return await User.find({
    _id: { $ne: authUserId }, // Exclude authenticated user
    mobile_number: { $in: phoneNumbers },
  }).populate('currency_id');
}

/**
 * Stores a user in the database.
 *
 * @param data - The user data to be stored.
 * @param options - Options for the save operation.
 * @returns A promise that resolves to the saved user document.
 */

export async function storeUser(data: any, options = {}): Promise<IUser> {
  const user = new User(data);
  return await user.save(options);
}

/**
 * Updates a user in the database.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Object} data - The data to update the user with.
 * @param {Object} [options={}] - Optional settings for updating the user.
 * @returns {Promise<IUser | null>} - A promise that resolves to the updated user document.
 */
export async function updateUser(id: string, data: any, options = {}): Promise<IUser | null> {
  const user = await User.findByIdAndUpdate(id, data, {
    new: true,
    ...options,
  });

  return user;
}

export async function removeUser(id: string, options = {}): Promise<IUser | null> {
  return await User.findByIdAndDelete(id, options);
}

/**
 * Searches for users in the database based on a given query and limit.
 *
 * @param {Object} query - The query to filter users with.
 * @param {number} limit - The maximum number of users to retrieve.
 * @returns {Promise<IUser[]>} - The list of matching users.
 */
export async function searchUsersByQuery(query: object, limit: number): Promise<IUser[]> {
  return await User.find(query).select(projection).populate('currency_id').limit(limit);
}
