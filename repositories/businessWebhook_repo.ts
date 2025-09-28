// @ts-nocheck
// @ts-nocheck
import BusinessWebhook from '../models/business-webhook';

const projection = {
  business_id: 1,
  active: 1,
  url: 1,
  secret: 1,
  events: 1,
};

export async function getBusinessWebhookByBusinessId(businessId: string) {
  return await BusinessWebhook.find({ business_id: businessId }, projection);
}

export async function getBusinessWebhookById(id: string) {
  return await BusinessWebhook.findById(id).select(projection);
}

export async function getBusinessWebhookByKey(key: string) {
  return await BusinessWebhook.findOne({ key }, projection);
}

export async function getBusinessWebhookByBusinessIdAndUrl(businessId: string, url: string) {
  return await BusinessWebhook.findOne({ business_id: businessId, url }, projection);
}

export async function getBusinessWebhookByBusinessIdAndUrlAndSecret(
  businessId: string,
  url: string,
  secret: string
) {
  return await BusinessWebhook.findOne({ business_id: businessId, url, secret }, projection);
}

export async function createBusinessWebhook(data: any, options = {}) {
  const webhook = new BusinessWebhook(data);
  return await webhook.save(options);
}

export async function updateBusinessWebhook(id: any, data: any, options = {}) {
  return await BusinessWebhook.findByIdAndUpdate(id, data, {
    new: true,
    upsert: true,
    ...options,
  });
}

export async function deleteBusinessWebhook(id: any, options = {}) {
  return await BusinessWebhook.findByIdAndDelete(id, options);
}
