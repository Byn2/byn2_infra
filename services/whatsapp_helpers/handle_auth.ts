import * as userService from "@/services/user_service"
import * as authService from "@/services/auth_service"
import {initialMessageTemplate, congratulationsMessageTemplate, mainMenuMessageTemplate} from "@/lib/whapi_message_template"
import {sendButtonMessage} from "@/lib/whapi"
import jwt from 'jsonwebtoken';
import {getBotIntentBySession, storeBotIntent} from '@/services/bot_intent_service'
import {
    startTransaction,
    commitTransaction,
    abortTransaction,
  } from "@/lib/db_transaction";

export async function handleAuth(message: any) {
    const session = await startTransaction();
    const mobile = `+${message.from}`
    const fetchedUser = await userService.fetchUserByMobileBot(mobile);
    let botIntent;
   
    //console.log(fetchedUser);
    if (!fetchedUser.success ) {
        
        const botToken = await generate3DayToken(mobile);
        const sessionToken = await generate5MinToken(mobile);
        //create user
        const newUser = await authService.botLogin({
            mobile_number: mobile,
            name: message.from_name,
            bot_token: botToken,
            bot_session: sessionToken,
        }, session);

        await storeBotIntent({
            bot_session: sessionToken,
            intent: "start",
        }, session);

        await commitTransaction(session);

      const ctx = await initialMessageTemplate(message.from_name, message.from );
      await sendButtonMessage(ctx);
    }else{
        const user = fetchedUser.data;
        const botToken = await verifyToken(user.bot_token);
        const sessionToken = await verifyToken(user.bot_session);
            
        //check for valid bot token
        if(botToken.valid){
            //continue wit the chat
            if(sessionToken.valid){
                console.log("Session token is valid");
                //check the intent
                botIntent = await getBotIntentBySession(user.bot_session);

                const getStartedButton = message.reply?.buttons_reply?.id;
                if(getStartedButton === "ButtonsV3:get_started"){
                    //send otp
                    console.log('sending congrats message')
                    const ctx = await congratulationsMessageTemplate(message.from_name, message.from );
                    console.log(ctx);
                    await sendButtonMessage(ctx);
                }
                
            }else{
                console.log("Session token is invalid");
                const sessionToken = await generate5MinToken(mobile);

                //update user
                await userService.updateUser(user._id, {
                    bot_session: sessionToken,
                }, session);

                botIntent = await storeBotIntent({
                    bot_session: sessionToken,
                    intent: "start",
                }, session);
                
                await commitTransaction(session);
                const ctx = await mainMenuMessageTemplate(message.from_name, message.from );
                await sendButtonMessage(ctx);
            }
        }else{
            console.log("Bot token is invalid");
            //send OTp 
            //and generate new bot token
        }
       
    
    }
 
    return {success: true, botIntent, user: fetchedUser.data}
}

export const generate3DayToken = async (mobile_number: string) => {
    return jwt.sign(
      { mobile: mobile_number },
      process.env.SECRET_ACCESS_TOKEN || "your-secret-key",
      { expiresIn: "3d" } // 3 days
    );
  };

  export const generate5MinToken = async (mobile_number: string) => {
    return jwt.sign(
      { mobile: mobile_number },
      process.env.SECRET_ACCESS_TOKEN || "your-secret-key",
      { expiresIn: "5m" } // 5 minutes
    );
  };


  export const verifyToken = async (token: string) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN || "your-secret-key");
      return { valid: true, expired: false, decoded };
    } catch (err: any) {
      return {
        valid: false,
        expired: err.name === "TokenExpiredError",
        decoded: null,
        message: err.message
      };
    }
  };
  