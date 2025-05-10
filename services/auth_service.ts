import * as userService from './user_service';
import User from '../models/user';
import * as walletService from './wallet_service';
import * as currencyService from './currency_service';
import { getCountryCurrency } from '../lib/helpers';
 import bcrypt from 'bcrypt';
 import { sendSMSNotification } from '../notifications/sms_notification';
// import { kycVerify } from './monime_service.js';
import {connectDB} from '../lib/db'

/**
 * Registers a new user.
 *
 * @param {Object} data - The user registration data.
 * @param {String} data.name - The user's name.
 * @param {String} data.email - The user's email address.
 * @param {String} data.password - The user's password.
 * @param {String} data.country_code - The user's country code.
 * @param {Object} session - The mongoose session object.
 * @returns {Promise<User|null>} The registered user, or null if registration failed.
 */
export async function registerUser(data, session) {
  await connectDB();
  const { name, email, password, country_code } = data;

  const country_details = await getCountryCurrency(country_code);

  console.log(country_details);

  //check if user already exists
  await userService.fetchUserByMobile(email);

  //generate 6 digit random number
  let code = Math.floor(100000 + Math.random() * 900000);

  const currency = await currencyService.storeCurrency(
    {
      code: country_details.code,
      name: country_details.name,
      symbol: country_details.symbol,
    },
    session
  );

  const user = await userService.storeUser(
    {
      name,
      mobile_number: email,
      password,
      currency_id: currency._id,
    },
    session
  );


  //send verification code
  await sendSMSNotification(
    user.mobile_number,
    `B-${code} is your verification code.`
  );

  const updatedUser = await userService.updateUser(
    user._id,
    {
      mobile_verify_code: code,
      mobile_verify_code_sent_at: new Date(),
    },
    { session }
  );

  if (!updatedUser) return null;

  await walletService.createWallet(updatedUser.mobile_number);

  //setImmediate(() => kycVerify(updatedUser, '', session));

  return updatedUser;
}

/**
 * Authenticates a user based on their mobile number and password.
 *
 * @param {{ email: string, password: string }} data - The user's mobile number and password.
 * @returns {Promise<{ success: boolean, error?: string, user?: User}>} - The user document if authentication was successful, or an error message if not.
 */
export async function loginUser(data) {

  await connectDB();
 
  const { email, password } = data;


  const user = await User.findOne({ mobile_number: email });

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { success: false, error: 'Invalid credentials' };
  }

  await walletService.createWallet(user.mobile_number);

  return { success: true, user };
}

export async function OtpLogin(email, session){
  await connectDB();

  let user = await User.findOne({ mobile_number: email })
  
 
  if (!user) {
    const defaultName = email;
    console.log(defaultName);
    //const defaultTag = slugify(defaultName, { lower: true, strict: true });
    const country_details = await getCountryCurrency('SL'); // or dynamic if available
    const currency = await currencyService.storeCurrency({
      code: country_details.code,
      name: country_details.name,
      symbol: country_details.symbol,
    }, session);

    user = await userService.storeUser(
      {
        name: defaultName,
        mobile_number: email,
        auth_provider: 'custom',
        currency_id: currency._id,
      },
      session
    );
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save OTP and timestamp
  user.mobile_verify_code = otp;
  user.mobile_verify_code_sent_at = new Date();
  await user.save();

  // Send OTP via SMS
  await sendSMSNotification(
    user.mobile_number,
    `B-${otp} is your login code.`
  );

  const updatedUser = await userService.updateUser(
    user._id,
    {
      mobile_verify_code: otp,
      mobile_verify_code_sent_at: new Date(),
    },
    { session }
  );

  if (!updatedUser) return null;

  await walletService.createWallet(updatedUser.mobile_number);

  return updatedUser;
}

export async function botLogin(data, session){
  await connectDB();

  const country_details = await getCountryCurrency('SL'); // or dynamic if available
    const currency = await currencyService.storeCurrency({
      code: country_details.code,
      name: country_details.name,
      symbol: country_details.symbol,
    }, session);

    const user = await userService.storeUser(
      {
        name: data.name,
        mobile_number: data.mobile_number,
        auth_provider: 'custom',
        currency_id: currency._id,
        bot_token: data.bot_token,
        bot_session: data.bot_session,
      },
      session
    );
  

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save OTP and timestamp
  user.mobile_verify_code = otp;
  user.mobile_verify_code_sent_at = new Date();
  await user.save();

  const updatedUser = await userService.updateUser(
    user._id,
    {
      mobile_verify_code: otp,
      mobile_verify_code_sent_at: new Date(),
    },
    { session }
  );

  if (!updatedUser) return null;

  await walletService.createWallet(updatedUser.mobile_number);

  return updatedUser;
}

/**
 * Verifies the OTP provided by the user. If the OTP is valid, the user's mobile number is marked as verified.
 * @param {User} user - The user to verify the OTP for
 * @param {Object} data - The data of the OTP
 * @param {String} data.code - The OTP provided by the user
 * @param {Session} session - The session of the user
 * @returns {Promise<Object>} An object with a `success` property indicating whether the OTP is valid or not, and a `message` property with a message describing the result of the verification
 */
export async function verifyOTP(user, data, session) {
  const { code } = data;

  if (user.mobile_verified) {
    return { success: true, message: 'OTP has already been verified' };
  }

  if (code != user.mobile_verify_code) {
    return await handleInvalidCode(user, session);
  }

  const secondsOfValidation = process.env.MOBILE_SECONDS_OF_VALIDATION;
  const verifyCodeSentAt = new Date(user.mobile_verify_code_sent_at);
  const currentTime = new Date();
  const diffInSeconds = Math.floor((currentTime - verifyCodeSentAt) / 1000);

  if (diffInSeconds > secondsOfValidation) {
    return await handleExpiredCode(user, session);
  }

  await userService.updateUser(
    user._id,
    {
      mobile_verified_at: new Date(),
      mobile_verified: true,
    },
    { session }
  );

  return { success: true, message: 'Mobile number successfully verified.' };
}

async function handleInvalidCode(user, session) {
  const maxAttempts = process.env.MOBILE_MAX_ATTEMPTS;
  const attemptsLeft = user.mobile_attempts_left;

  if (attemptsLeft <= 1) {
    return await handleMaxAttemptsReached(user, session);
  }

  await userService.updateUser(
    user._id,
    {
      mobile_attempts_left: attemptsLeft - 1,
    },
    { session }
  );

  return {
    success: false,
    message: `Invalid verification code. You have ${
      attemptsLeft - 1
    } attempts left.`,
  };
}

export async function resendOTP(user, session) {
  //generate 6 digit random number
  let code = Math.floor(100000 + Math.random() * 900000);

  //   await smsService.sendSMSNotification(
  //     user.mobile_number,
  //     `B-${code} is your verification code.`
  //   );

  await userService.updateUser(
    user._id,
    {
      mobile_verify_code: code,
      mobile_verify_code_sent_at: new Date(),
    },
    { session }
  );

  return { success: true, message: 'OTP has been sent' };
}

export async function sendNewOtp(number: string, session) {
  //generate 6 digit random number
  let code = Math.floor(100000 + Math.random() * 900000);

  //find user by number
  const user = await userService.fetchUserByMobile(number);

  if (!user) {
    return { success: false, message: 'Phone number not found.' };
  }

  await sendSMSNotification(
    user.mobile_number,
    `B-${code} is your verification code.`
  );

  await userService.updateUser(
    user._id,
    {
      mobile_verify_code: code,
      mobile_verify_code_sent_at: new Date(),
      mobile_verified_at: null,
    },
    { session }
  );

  return { success: true, message: 'OTP has been sent' };
}

export async function resetPwdOTPVerify(number, code, session) {
  console.log('resetPwdOTPVerify', number, code);

  //find user by number
  const user = await User.findOne({ mobile_number: number });

  if (!user) {
    return { success: false, message: 'Phone number not found.' };
  }

  if (user.mobile_verified_at) {
    return { success: true, message: 'OTP has already been verified' };
  }

  if (code != user.mobile_verify_code) {
    return await handleInvalidCode(user, session);
  }

  const secondsOfValidation = process.env.MOBILE_SECONDS_OF_VALIDATION;
  const verifyCodeSentAt = new Date(user.mobile_verify_code_sent_at);
  const currentTime = new Date();
  const diffInSeconds = Math.floor((currentTime - verifyCodeSentAt) / 1000);

  if (diffInSeconds > secondsOfValidation) {
    return await handleExpiredCode(user, session);
  }

  await userService.updateUser(
    user._id,
    {
      mobile_verified_at: new Date(),
      mobile_verified: true,
    },
    { session }
  );

  return { success: true, message: 'Mobile number successfully verified.' };
}

export async function changePassword(number, newPassword, session) {
  //find user by number
  const user = await userService.fetchUserByMobile(number);

  if (!user) {
    return { success: false, message: 'Phone number not found.' };
  }

  const salt = await bcrypt.genSalt(10);
  const pwd = await bcrypt.hash(newPassword, salt);

  await userService.updateUser(
    user._id,
    {
      password: pwd,
    },
    { session }
  );

  return { success: true, message: 'Password has been changed' };
}

async function handleMaxAttemptsReached(user, session) {
  const maxAttemptsBan = process.env.MOBILE_ATTEMPTS_BAN_SECONDS;
  const lastAttemptDate = new Date(user.mobile_last_attempt_date);
  const currentTime = new Date();
  const secondsLeft =
    maxAttemptsBan - Math.floor((currentTime - lastAttemptDate) / 1000);

  if (secondsLeft > 0) {
    const formattedTime = formatTimeLeft(secondsLeft);
    return {
      success: false,
      message: `You have exceeded the maximum number of attempts. Please try again in ${formattedTime}.`,
    };
  }

  return await generateNewCode(user, session);
}

async function handleExpiredCode(user, session) {
  return await generateNewCode(user, session);
}

async function generateNewCode(user, session) {
  const code = Math.floor(111111 + Math.random() * 888888);

  await userService.updateUser(
    user._id,
    {
      mobile_verify_code: code,
      mobile_verify_code_sent_at: new Date(),
      mobile_attempts_left: process.env.MOBILE_MAX_ATTEMPTS,
    },
    { session }
  );

  await sendSMSNotification(
    user.mobile_number,
    `B-${code} is your verification code.`
  );

  return {
    success: false,
    message: 'The verification code has expired. A new code has been sent.',
  };
}

function formatTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
