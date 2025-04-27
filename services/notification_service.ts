import * as notificationRepo from '../repositories/notification_repo';

export async function fetchNotifications(user, limit) {
  return await notificationRepo.fetchNotifications(user._id, 'User', limit);
}

export async function storeNotification(data, options = {}) {
  return await notificationRepo.storeNotification(data, options);
}
