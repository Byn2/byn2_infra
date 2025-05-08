import * as businessApiKeyRepo from "@/repositories/businessApiKey_repo";
import * as userService from "@/services/user_service";
import { generateApiKey } from "@/lib/util";

export async function getBusinessApiKeyByBusinessId(businessId: string) {
  return await businessApiKeyRepo.getBusinessApiKeyByBusinessId(businessId);
}

export async function getBusinessApiKeyByKey(key: string) {
  return await businessApiKeyRepo.getBusinessApiKeyByKey(key);
}

export async function getBusinessApiKeyById(id: string) {
  return await businessApiKeyRepo.getBusinessApiKeyById(id);
}

export async function createBusinessApiKey(data, session) {
  const { business_id } = data;

  const user = await userService.fetchUserById(business_id);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  const apiKey = await generateApiKey("byn2");

  data = {
    ...data,
    key: apiKey,
  };

  return await businessApiKeyRepo.createBusinessApiKey(data, session);
}

export async function updateBusinessApiKey(id, data, session) {
  const { business_id } = data;

  const user = await userService.fetchUserById(business_id);

  if (!user) {
    return { success: false, message: "Business not found" };
  }

  return await businessApiKeyRepo.updateBusinessApiKey(id, data, session);
}

export async function deleteBusinessApiKey(id, data, session) {

  return await businessApiKeyRepo.deleteBusinessApiKey(id, session);
}
