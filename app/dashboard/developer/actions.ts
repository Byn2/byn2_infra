"use server";

import { revalidatePath } from "next/cache";
import * as businessWebHook from "@/services/businessWebhook_service";
import * as businessApiKey from "@/services/businessApiKey_service";
import {
  startTransaction,
  commitTransaction,
  abortTransaction,
} from "@/lib/db_transaction";
import { getAuthenticatedUser } from "@/lib/middleware/get-auth-user";

// API Key Actions
export async function generateApiKey(name: string) {
  const session = await startTransaction();
  try {
    const authUser = await getAuthenticatedUser();

    if ("user" in authUser === false) return authUser;

    const result = await businessApiKey.createBusinessApiKey(
      { name: name, business_id: authUser.user._id },
      session
    );

    console.log("Result:", result);
    if (!result || !result.key) {
      return { success: false, error: "Failed to generate API key" };
    }

    await commitTransaction(session);
    revalidatePath("/dashboard/merchant");

    return {
      success: true,
      key: result.key,
      message: "API key generated successfully",
    };
  } catch (error) {
    await abortTransaction(session);
    console.error("API key generation error:", error);

    return { success: false, error: "Failed to generate API key" };
  }
}

export async function toggleApiKeyStatus(id: string, active: boolean) {
  const session = await startTransaction();
  try {
    const authUser = await getAuthenticatedUser();

    if ("user" in authUser === false) return authUser;

    const result = await businessApiKey.updateBusinessApiKey(
      id,
      { business_id: authUser.user._id, active: active },
      session
    );
    console.log("Result:", result);
    if (!result || !result.key) {
      return { success: false, error: "Failed to generate API key" };
    }

    await commitTransaction(session);
    revalidatePath("/dashboard/merchant");

    return {
      success: true,
      key: result.key,
      message: active ? "API key activated" : "API key deactivated",
    };
  } catch (error) {
    console.error("API key update error:", error);
    return { success: false, error: "Failed to update API key" };
  }
}

export async function deleteApiKey(id: string) {
  const session = await startTransaction();
  try {
    const authUser = await getAuthenticatedUser();

    if ("user" in authUser === false) return authUser;

    const result = await businessApiKey.deleteBusinessApiKey(
      id,
      { business_id: authUser.user._id },
      session
    );
    console.log("Result:", result);
    if (!result || !result.key) {
      return { success: false, error: "Failed to generate API key" };
    }

    await commitTransaction(session);
    revalidatePath("/dashboard/merchant");

    return {
      success: true,
      key: result.key,
      message: "Api key deleted",
    };
  } catch (error) {
    console.error("API key update error:", error);
    return { success: false, error: "Failed to update API key" };
  }
}

// Webhook Actions
export async function createWebhook(url: string, events: string[]) {
  const session = await startTransaction();
  try {
    const authUser = await getAuthenticatedUser();

    if ("user" in authUser === false) return authUser;

    console.log("Creating webhook...", {
      url,
      events,
    });

    const result = await businessWebHook.createBusinessWebhook(
      { url, business_id: authUser.user._id, events },
      session
    );

    if (!result || !result.secret) {
      return { success: false, error: "Failed to generate API key" };
    }

    await commitTransaction(session);
    revalidatePath("/dashboard/merchant");

    return {
      success: true,
      webhook: {
        _id: result._id,
        url: result.url,
        events: result.events,
        active: result.active,
        secret: result.secret,
        createdAt: result.createdAt,
      },
      message: "API key generated successfully",
    };
  } catch (error) {
    console.error("Webhook creation error:", error);
    return { success: false, error: "Failed to create webhook" };
  }
}

export async function toggleWebhookStatus(id: string, active: boolean) {
  const session = await startTransaction();
  try {
    const authUser = await getAuthenticatedUser();

    if ("user" in authUser === false) return authUser;

    const result = await businessWebHook.updateBusinessWebhook(
      id,
      { business_id: authUser.user._id, active: active },
      session
    );
    console.log("Result:", result);
    if (!result || !result.secret) {
      return { success: false, error: "Failed to update webhook" };
    }

    await commitTransaction(session);
    revalidatePath("/dashboard/merchant");

    return {
      success: true,
      webhook: {
        _id: result._id,
        url: result.url,
        events: result.events,
        active: result.active,
        secret: result.secret,
        createdAt: result.createdAt,
      },
      message: active ? "Webhook activated" : "Webhook deactivated",
    };
  } catch (error) {
    console.error("Webhook failed to update:", error);
    return { success: false, error: "Failed to update webhook" };
  }
}

export async function testWebhook(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/payment/webhook-test`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ webhookId: id }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.error || "Failed to test webhook" };
    }

    const data = await response.json();
    return { success: data.success, message: data.message };
  } catch (error) {
    console.error("Webhook test error:", error);
    return { success: false, error: "Failed to test webhook" };
  }
}

export async function deleteWebhook(id: string) {
  const session = await startTransaction();
  try {
    const authUser = await getAuthenticatedUser();

    if ("user" in authUser === false) return authUser;

    const result = await businessWebHook.deleteBusinessWebhook(
      id,
      { business_id: authUser.user._id },
      session
    );
    if (!result || !result.secret) {
      return { success: false, error: "Failed to generate API key" };
    }

    await commitTransaction(session);
    revalidatePath("/dashboard/merchant");

    return {
      success: true,
      key: result.key,
      message: "Webhook deleted",
    };
  } catch (error) {
    console.error("API key update error:", error);
    return { success: false, error: "Failed to update API key" };
  }
}

// Settings Actions
export async function updateCustomDomain(customDomain: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || ""}/api/merchant/settings`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customDomain }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.error || "Failed to update custom domain",
      };
    }

    const data = await response.json();
    revalidatePath("/dashboard/merchant");
    return { success: true, message: "Custom domain updated successfully" };
  } catch (error) {
    console.error("Settings update error:", error);
    return { success: false, error: "Failed to update custom domain" };
  }
}

// Data Fetching Actions
// export async function fetchApiKeys() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/merchant/api-keys`, {
//       cache: "no-store",
//     })

//     if (!response.ok) {
//       throw new Error("Failed to fetch API keys")
//     }

//     const data = await response.json()
//     return { success: true, apiKeys: data.apiKeys || [] }
//   } catch (error) {
//     console.error("API keys fetch error:", error)
//     return { success: false, apiKeys: [], error: "Failed to load API keys" }
//   }
// }

// export async function fetchWebhooks() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/merchant/webhooks`, {
//       cache: "no-store",
//     })

//     if (!response.ok) {
//       throw new Error("Failed to fetch webhooks")
//     }

//     const data = await response.json()
//     return { success: true, webhooks: data.webhookEndpoints || [] }
//   } catch (error) {
//     console.error("Webhooks fetch error:", error)
//     return { success: false, webhooks: [], error: "Failed to load webhooks" }
//   }
// }

// export async function fetchSettings() {
//   try {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/merchant/settings`, {
//       cache: "no-store",
//     })

//     if (!response.ok) {
//       throw new Error("Failed to fetch settings")
//     }

//     const data = await response.json()
//     return {
//       success: true,
//       settings: {
//         hostedPaymentUrl: data.hostedPaymentUrl || "",
//         customDomain: data.customDomain || "",
//       },
//     }
//   } catch (error) {
//     console.error("Settings fetch error:", error)
//     return {
//       success: false,
//       settings: {
//         hostedPaymentUrl: "",
//         customDomain: "",
//       },
//       error: "Failed to load settings",
//     }
//   }
// }
