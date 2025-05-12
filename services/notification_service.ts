import * as notificationRepo from '../repositories/notification_repo';

export async function fetchNotifications(user: any, limit: any) {
  return await notificationRepo.fetchNotifications(user._id, 'User', limit);
}

export async function storeNotification(data: any, options = {}) {
  return await notificationRepo.storeNotification(data, options);
}
