//@ts-check
import BusinessApiKey from '../models/business-api-key';

const projection = {
    business_id: 1,
    key: 1,
    name: 1,
    active: 1,
    lastUsed: 1,
};

export async function getBusinessApiKeyByBusinessId(businessId: string) {
  return await BusinessApiKey.find({ business_id: businessId }).select(projection);
}

export async function getBusinessApiKeyByKey(key: string) {
  return await BusinessApiKey.findOne({ key }, projection);
}

export async function getBusinessApiKeyById(id: string) {
  return await BusinessApiKey.findById(id).select(projection);
}

export async function createBusinessApiKey(data, options = {}) {
 const api = new BusinessApiKey(data);
 return await api.save(options);
}

export async function updateBusinessApiKey(id, data, options = {}) {
  return await BusinessApiKey.findByIdAndUpdate(id, data, {
    new: true,
    upsert: true,
    ...options,
  });
}

export async function deleteBusinessApiKey(id, options = {}) {
  return await BusinessApiKey.findByIdAndDelete(id, options);
}

