//@ts-check
import Notification from '../models/notification';

/**
 * Fetches notifications for a specified notifiable entity.
 *
 * @param id - The ID of the notifiable entity.
 * @param tableName - The type of the notifiable entity.
 * @param limit - The maximum number of notifications to retrieve.
 * @returns A promise that resolves to an array of notification documents.
 */

export async function fetchNotifications(id: string, tableName: string, limit: number) {
  const notifications = await Notification.find({
    notifiable: { type: tableName, id: id },
  })
    .sort({ created_at: -1 })
    .limit(10)
    .skip(0)
    .select('_id title message read createdAt')
    .limit(limit);
  return notifications;
}

/**
 * Stores a notification in the database.
 *
 * @param data - The notification data to be stored. Must contain `title`, `message`, and `notifiable` properties.
 * @param options - The options to pass to the underlying Model.save method.
 * @returns A promise that resolves to the saved notification document.
 */
export async function storeNotification(data, options = {}) {
  const notification = new Notification(data);
  await notification.save(options);
}
