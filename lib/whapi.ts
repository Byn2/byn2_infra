const whapiUrl = process.env.WHAPI_URL
const whapiToken = process.env.WHAPI_TOKEN
const whapiImageUrl = `${whapiUrl}/messages/image`
const whapiTextUrl = `${whapiUrl}/messages/text`
const whapiButtonUrl = `${whapiUrl}/messages/interactive`

export async function sendTextMessage(phoneNumber: string, message: string) {
    try{

    }catch(error){
        
    }
}

export async function sendImageMessage(phoneNumber: string, imageUrl: string) {
    try{

    }catch(error){
        
    }
}

export async function sendButtonMessage(phoneNumber: string, message: string, buttons: string[]) {
    try{

    }catch(error){
        
    }
}


export const formatWhatsAppNumber = (phoneNumber: string) => {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, "");
  
    // WhatsApp API expects numbers in international format without '+' or '00'
    // For Sierra Leone numbers (232 country code)
    if (digits.startsWith("232") && digits.length === 12) {
      return digits; // Already in correct format
    }
  
    // For numbers with country code but extra characters
    if (digits.length > 9) {
      // Remove leading zeros and ensure proper country code
      return digits.startsWith("0") ? digits.slice(1) : digits;
    }
  
    // Default case - assume it's already in local format
    // Add country code if missing (232 for Sierra Leone)
    return `232${digits}`;
  };