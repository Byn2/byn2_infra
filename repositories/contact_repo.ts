// @ts-nocheck
// @ts-nocheck
import Contacts from '../models/contact';

/**
 * Retrieves all contacts associated with a given user ID.
 *
 * @param userId - The ID of the user whose contacts are to be retrieved.
 * @returns A promise that resolves to an array of contact documents.
 */

export async function findContactByUserId(userId: string) {
  const contacts = await Contacts.find({ user_id: userId });
  //if (!contacts) throw new AppError('No contact found with that id', 404);
  return contacts;
}

/**
 * Retrieves a contact associated with a given user ID and contact ID.
 *
 * @param userId - The ID of the user whose contact is to be retrieved.
 * @param contactId - The ID of the contact to be retrieved.
 * @returns A promise that resolves to the contact document.
 */
export async function findContactByUserIdAndContactId(userId: string, contactId: string) {
  const contacts = await Contacts.findOne({
    user_id: userId,
    contact_id: contactId,
  });
  //if (!contacts) throw new AppError('No contact found with that id', 404);
  return contacts;
}

/**
 * Stores a contact in the database.
 *
 * @param data - The contact data to be stored, must contain user_id and contact_id properties.
 * @param options - The options to pass to the underlying Model.save method.
 * @returns A promise that resolves to the saved contact document.
 */
export async function storeContact(data: any, options = {}) {
  const contact = new Contacts(data);
  await contact.save(options);
}
