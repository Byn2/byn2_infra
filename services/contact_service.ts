//@ts-nocheck
//@ts-ignore
import { IUser } from '@/types/user';
import * as contactRepo from '../repositories/contact_repo';
import * as userRepo from '../repositories/user_repo';

export async function fetchContacts(user: IUser) {
  const userContacts = await contactRepo.findContactByUserId(user._id);
  const associatedUsers = await getContactDetails(userContacts);
  return associatedUsers;

}

export async function uploadContacts(user: IUser, data, session) {
  const contacts = data.contacts;

  const matchingUsers = await findMatchingUsers(contacts, user._id);

  await createContact(user, matchingUsers, session);

  const userContacts = await contactRepo.findContactByUserId(user._id);

  const associatedUsers = await getContactDetails(userContacts);

  return associatedUsers;
}

async function findMatchingUsers(phoneNumbers, authUserId: string) {
  const cleanedPhoneNumbers = phoneNumbers.map((phoneNumber) =>
    phoneNumber.replace(/[ -]/g, '')
  );

  // Find users whose mobile number matches any extracted phone number
  // and exclude the authenticated user
  return await userRepo.findMatchingUsersByPhoneNumber(
    cleanedPhoneNumbers,
    authUserId
  );
}

async function createContact(authUser, contacts, session) {
  for (const contact of contacts) {
    const existingContact = await contactRepo.findContactByUserIdAndContactId(
      authUser._id,
      contact._id
    );

    if (!existingContact) {
      await contactRepo.storeContact(
        {
          user_id: authUser._id,
          contact_id: contact._id,
        },
        { session }
      );
    }
  }
}

async function getContactDetails(userContacts) {
  const associatedUsers = [];
  for (const contact of userContacts) {
    const user = await userRepo.findUserById(contact.contact_id);

    if (user) {
      associatedUsers.push(user);
    }
  }
  return associatedUsers;
}
