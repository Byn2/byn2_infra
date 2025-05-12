import * as businessWebhook from "../repositories/businessWebhook_repo";
import * as userService from "./user_service";
import { generateWebhookSecret } from "@/lib/util";

export async function getBusinessWebhookByBusinessId(businessId: string) {
  return await businessWebhook.getBusinessWebhookByBusinessId(businessId);
}

export async function getBusinessWebhookById(id: string) {
  return await businessWebhook.getBusinessWebhookById(id);
}

export async function getBusinessWebhookByBusinessIdAndUrl(
  businessId: string,
  url: string
) {
  return await businessWebhook.getBusinessWebhookByBusinessIdAndUrl(
    businessId,
    url
  );
}

export async function createBusinessWebhook(data: any, session: any) {
  const { business_id } = data;

  const user = await userService.fetchUserById(business_id);

  if (!user) {
    return { success: false, message: "Business not found" };
  }

  const secret = generateWebhookSecret();

  data = {
    ...data,
    business_id: business_id,
    secret: secret,
  };

  return await businessWebhook.createBusinessWebhook(data, session);
}

export async function updateBusinessWebhook(id: any, data: any, session: any) {
  const { business_id } = data;

  const user = await userService.fetchUserById(business_id);

  if (!user) {
    return { success: false, message: "Business not found" };
  }

  return await businessWebhook.updateBusinessWebhook(id, data, session);
}

export async function deleteBusinessWebhook(id: any, data: any, session: any) {
  return await businessWebhook.deleteBusinessWebhook(id, session);
}
