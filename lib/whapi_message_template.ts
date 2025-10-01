

// export async function otpVerifyMessageTemplate(otp: string) {}

// export async function otpResendMessageTemplate(otp: string) {}

export async function congratulationsMessageTemplate(name, mobile) {
  return {
    body: {
      text: `🎉 Congratulations ${name}! We’re thrilled to have you on board.

You can now deposit with mobile money or crypto, transfer funds, withdraw to your account, and check your balance — all from WhatsApp.`,
    },
    footer: {
      text: 'Enjoy your experience with Mocha!',
    },
    action: {
      list: {
        sections: [
          {
            title: 'Select an option',
            rows: [
              {
                id: 'd1',
                title: 'Deposit',
                description: 'Deposit with mobile money or crypto',
              },
              {
                id: 't1',
                title: 'Transfer',
                description: 'Transfer funds to any WhatsApp number',
              },
              {
                id: 'w1',
                title: 'Withdraw',
                description: 'Withdraw funds to your account',
              },
              {
                id: 'c1',
                title: 'Check Balance',
                description: 'Check your wallet balance',
              },
              {
                id: 'csoon',
                title: 'Invest in Stocks',
                description: 'Coming soon',
              },
            ],
          },
        ],
        label: 'Mocha Menu',
      },
    },
    type: 'list',
    to: mobile,
  };
}

function getTimeBasedGreeting(name: string): string {
  const hour = new Date().getHours();
  
  const morningGreetings = [
    `Good morning, ${name}! Hope your morning is going well.`,
    `Good morning, ${name}! Hope you're having a bright start to your day.`,
    `Good morning, ${name}! Trust you're having a wonderful morning.`,
    `Good morning, ${name}! Hope your day is off to a great start.`,
    `Good morning, ${name}! Wishing you a productive and blessed morning.`
  ];
  
  const afternoonGreetings = [
    `Good afternoon, ${name}! Hope you're having a wonderful day.`,
    `Good afternoon, ${name}! Hope your afternoon is treating you well.`,
    `Good afternoon, ${name}! Trust your day is going smoothly.`,
    `Good afternoon, ${name}! Hope you're having a productive afternoon.`,
    `Good afternoon, ${name}! Wishing you a pleasant rest of your day.`
  ];
  
  const eveningGreetings = [
    `Good evening, ${name}! Hope your evening is treating you kindly.`,
    `Good evening, ${name}! Hope you're winding down nicely.`,
    `Good evening, ${name}! Trust you've had a wonderful day.`,
    `Good evening, ${name}! Hope you're having a relaxing evening.`,
    `Good evening, ${name}! Wishing you a peaceful end to your day.`
  ];
  
  const getRandomGreeting = (greetings: string[]) => {
    return greetings[Math.floor(Math.random() * greetings.length)];
  };
  
  if (hour < 12) {
    return getRandomGreeting(morningGreetings);
  } else if (hour < 17) {
    return getRandomGreeting(afternoonGreetings);
  } else {
    return getRandomGreeting(eveningGreetings);
  }
}

export async function mainMenuMessageTemplate(name, mobile) {
  const greeting = getTimeBasedGreeting(name);
  
  return {
    body: {
      text: `${greeting} \n It's always great to hear from you. \n\n How can I help you today?`,
    },

    action: {
      list: {
        sections: [
          {
            title: 'Select an option',
            rows: [
              {
                id: 'd1',
                title: 'Deposit',
                description: 'Deposit with mobile money or crypto',
              },
              {
                id: 't1',
                title: 'Send',
                description: 'Transfer funds to any WhatsApp number',
              },
              {
                id: 'w1',
                title: 'Withdraw',
                description: 'Withdraw funds to your account',
              },
              {
                id: 'c1',
                title: 'Check Balance',
                description: 'Check your wallet balance',
              },
              {
                id: 'csoon',
                title: 'Invest in Stocks',
                description: 'Coming soon',
              },
            ],
          },
        ],
        label: 'Mocha Menu',
      },
    },
    type: 'list',
    to: mobile,
  };
}

// New welcome message for first-time users (before account creation)
export async function welcomeNewUserMessageTemplate(name: string, mobile: string) {
  return {
    header: {
      text: 'Welcome to Mocha',
    },
    body: {
      text: `Hi ${name}! 👋\n\nWelcome to Mocha — your virtual financial assistant that makes managing money easy and secure.\n\n💰 *What I can help you with:*\n• Send money instantly to any WhatsApp number\n• Deposit funds via mobile money or crypto\n• Withdraw funds to your account\n• Check your balance anytime\n• Secure transactions with blockchain technology\n\nReady to get started with your free digital wallet?`,
    },
    footer: {
      text: `\n\nJoin thousands of users already using Mocha! 🚀`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Get Started',
          id: 'welcome_get_started',
        },
      ],
    },
    type: 'button',
    media:
      'https://images.unsplash.com/photo-1659018966825-43297e655ccf?q=80&w=1198&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    to: mobile,
  };
}

// Congratulations message for new users after account creation
export async function newUserCongratulationsMessageTemplate(name: string, mobile: string) {
  return {
    body: {
      text: `🎉 Welcome to Mocha, ${name}!\n\nYour digital wallet is now active and ready to use. You can now:\n\n💡 *Quick Commands:*\n• Type "menu" - View all options\n• Type "balance" - Check your balance\n• Type "help" - Get assistance\n• Type "cancel" - Stop any operation\n\nLet's explore what you can do with your new wallet!`,
    },
    footer: {
      text: `\n\nStart with a deposit or receive money from friends! 💜`,
    },
    action: {
      list: {
        sections: [
          {
            title: 'Get Started',
            rows: [
              {
                id: 'd1',
                title: 'Deposit Funds',
                description: 'Add money via mobile money or crypto',
              },
              {
                id: 'c1',
                title: 'Check Balance',
                description: 'View your current wallet balance',
              },
              {
                id: 't1',
                title: 'Send Money',
                description: 'Transfer funds to any WhatsApp number',
              },
              {
                id: 'w1',
                title: 'Withdraw',
                description: 'Withdraw funds to your account',
              },
            ],
          },
        ],
        label: 'Choose an option',
      },
    },
    type: 'list',
    to: mobile,
  };
}

// Welcome message for money recipients who are not in the database
export async function recipientWelcomeMessageTemplate(mobile: string, currency: string, amount: number, fromName: string) {
  return {
    body: {
      text: `🎉 Great news! You've received ${amount} ${currency} from ${fromName}!\n\n💰 *Your money is waiting for you*\n\nTo access your funds and start using Mocha's secure digital wallet, you'll need to create a free account. With Mocha you can:\n\n• Receive and send money instantly\n• Deposit via mobile money or crypto\n• Withdraw to your bank account\n• Secure transactions with blockchain\n\nWould you like to get started and claim your money?`,
    },
    footer: {
      text: `\n\nJoin thousands of users already using Mocha! 🚀`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Get Started',
          id: 'recipient_get_started',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

// Onboarding completion message for recipients after they create account
export async function recipientOnboardingCompleteTemplate(name: string, mobile: string, currency: string, amount: number, fromName: string) {
  return {
    body: {
      text: `🎉 Welcome to Mocha, ${name}!\n\nYour account is now active and your ${amount} ${currency} from ${fromName} is in your wallet!\n\n💡 *What's next?*\n• Check your balance to see your funds\n• Withdraw to your bank account\n• Send money to friends and family\n• Deposit more funds anytime\n\n**Quick Commands:**\n• Type "menu" for all options\n• Type "balance" to check funds\n• Type "help" for assistance`,
    },
    footer: {
      text: `\n\nEnjoy using Mocha! 💜`,
    },
    action: {
      list: {
        sections: [
          {
            title: 'Quick Actions',
            rows: [
              {
                id: 'c1',
                title: 'Check Balance',
                description: 'View your current balance',
              },
              {
                id: 'w1',
                title: 'Withdraw Funds',
                description: 'Withdraw to your bank account',
              },
              {
                id: 't1',
                title: 'Send Money',
                description: 'Transfer funds to others',
              },
              {
                id: 'd1',
                title: 'Deposit More',
                description: 'Add more funds to your wallet',
              },
            ],
          },
        ],
        label: 'Choose an option',
      },
    },
    type: 'list',
    to: mobile,
  };
}

/////#####################################-------------------------------------------------------------------

//deposit
export async function depositMethodMessageTemplate(mobile) {
  return {
    body: {
      text: `Choose how you'd like to add funds to your wallet:`,
    },
    action: {
      list: {
        sections: [
          {
            title: 'Deposit options',
            rows: [
              {
                id: 'do1',
                title: 'Mobile Money',
                description: 'Add funds using mobile money',
              },
              {
                id: 'do2',
                title: 'Crypto',
                description: 'Add funds using cryptocurrency',
              },
              {
                id: 'do3',
                title: 'Bank',
                description: 'Coming soon',
              },
            ],
          },
        ],
        label: 'Deposit Options',
      },
    },
    type: 'list',
    to: mobile,
  };
}

export async function mmDepositMessageTemplate1(mobile) {
  return {
    body: {
      text: 'Are you depositing from your own number or a different number?',
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Self',
          id: 'self',
        },
        {
          type: 'quick_reply',
          title: 'Different number',
          id: 'different_number',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function mmDepositMessageTemplateAmount() {
  return 'Please enter the amount you want to deposit in your local currency (e.g., 10):';
}

export async function mmDepositMessageTemplateConfirm(name, mobile, depositing_number, amount) {
  return {
    header: {
      text: 'Confirm Transaction',
    },
    body: {
      text: `Hi ${name}, you're about to make a deposit using Mobile Money.\n\nAmount: Le ${amount}\nPhone Number: ${depositing_number}\n\nDo you want to continue?`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Yes',
          id: 'mm_confirm',
        },
        {
          type: 'quick_reply',
          title: 'Cancel',
          id: 'cancel',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function mmDepositMessageTemplateUSSD(mobile, ussd) {
  return {
    header: {
      text: 'Complete Your Deposit',
    },
    body: {
      text: `\n\nTap "Copy Code" below, then dial the code on your phone to complete your deposit.`,
    },
    footer: {
      text: `\n\nWe'll notify you once your deposit is successful! ✅`,
    },
    action: {
      buttons: [
        {
          type: 'copy',
          title: 'Copy Code & Dial',
          id: 'self_ussd',
          copy_code: ussd,
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

//different number
export async function mmDepositMessageTemplateDifferentNumber() {
  return 'Please enter the phone number you want to use for this deposit (e.g., +232123456789):';
}

export async function mmDepositMessageTemplateUSSDDifferentNumber(mobile, ussd) {
  return {
    body: {
      text: 'Payment Code',
    },
    footer: {
      text: `\n\nCopy and send this code to the phone number funding the transaction to complete the payment.`,
    },
    action: {
      buttons: [
        {
          type: 'copy',
          title: 'Copy USSD',
          id: 'ussd_code',
          copy_code: ussd,
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

//crypto

export async function cryptoDepositMessageTemplate(mobile: string, walletAddress: string, qrCodeUrl?: string | null) {
  return {
    header: {
      text: 'Crypto Deposit',
    },
    body: {
      text: `💰 *Deposit USDC to your wallet*\n\n⚠️ *IMPORTANT WARNING:*\nThis account only receives USDC. Any other token sent here will be lost and won't be replaced.\n\n*Your Wallet Address:*\n${walletAddress}\n\n${qrCodeUrl ? 'Scan the QR code above or tap "Copy Address" below to copy your wallet address for the deposit.' : 'Tap "Copy Address" below to copy your wallet address for the deposit.'}`,
    },
    footer: {
      text: `\n\nOnly send SOLANA USDC to this address! 🔒`,
    },
    action: {
      buttons: [
        {
          type: 'copy',
          title: 'Copy Address',
          id: 'copy_wallet_address',
          copy_code: walletAddress,
        },
      ],
    },
    type: 'button',
    media: qrCodeUrl || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    to: mobile,
  };
}

//transfer
export async function transferMessageTemplateCurrency(mobile) {
  return {
    header: {
      text: 'Select Currency',
    },
    body: {
      text: 'Which currency would you like to send?',
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'USD',
          id: 'tt_usd',
        },
        {
          type: 'quick_reply',
          title: 'Local Currency (Le - Sierra Leone)',
          id: 'tt_local',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function transfertMessageTemplateAmountLocal() {
  return 'Enter the amount you want to send in Leones (Le). For example: 10';
}

export async function transfertMessageTemplateAmountUSD() {
  return 'Enter the amount you want to send in USD ($). For example: 1';
}

export async function transferMessageTemplateNumber() {
  return 'Enter the WhatsApp number you want to send money to (e.g., +232123456789):';
}

export async function transferMessageTemplateConfirmLocal(name, mobile, toNumber, amount) {
  return {
    header: {
      text: 'Confirm Transaction',
    },
    body: {
      text: `Hi ${name}, you're about to send money.\n\nAmount: Le ${amount}\nRecipient: ${toNumber}\n\nDo you want to continue?`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Yes',
          id: 'tt_confirm',
        },
        {
          type: 'quick_reply',
          title: 'Cancel',
          id: 'cancel',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function transferMessageTemplateConfirmUSD(name, mobile, toNumber, amount) {
  return {
    header: {
      text: 'Confirm Transaction',
    },
    body: {
      text: `Hi ${name}, you're about to send money.\n\nAmount: $${amount}\nRecipient: ${toNumber}\n\nDo you want to continue?`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Yes',
          id: 'tt_confirm',
        },
        {
          type: 'quick_reply',
          title: 'Cancel',
          id: 'cancel',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function transfertMessageTemplateStatusSender(
  name,
  currency,
  amount,
  status,
  toNumber
) {
  if (status === 'true') {
    return `✅ Hi ${name}, you successfully sent ${amount} ${currency} to ${toNumber}.`;
  } else {
    return `❌ Hi ${name}, your transfer of ${amount} ${currency} to ${toNumber} failed. Please try again later. If the problem continues, contact our support team.`;
  }
}

export async function transfertMessageTemplateAmountStatusReceiver(
  name,
  mobile,
  currency,
  amount,
  from
) {
  if (name) {
    return `🎉 Hi ${name}, you received ${amount} ${currency} from ${from}!`;
  } else {
    return `🎉 You received ${amount} ${currency} from ${from}! Create an account to access your funds.`;
  }
}

export async function depositSuccessMessageTemplate(name, mobile, amount, currency) {
  return `✅ Hi ${name}, you successfully deposited ${amount} ${currency}. Your wallet has been updated!`;
}

//withdraw
export async function withdrawMethodMessageTemplate(mobile) {
  return {
    body: {
      text: `Choose how you'd like to withdraw your funds:`,
    },
    action: {
      list: {
        sections: [
          {
            title: 'Withdraw options',
            rows: [
              {
                id: 'wo1',
                title: 'Mobile Money',
                description: 'Receive funds via mobile money',
              },
              {
                id: 'wo2',
                title: 'MoneyGram',
                description: 'Coming soon',
              },
            ],
          },
        ],
        label: 'Withdraw Options',
      },
    },
    type: 'list',
    to: mobile,
  };
}

export async function withdrawAmountMessageTemplate() {
  return 'Enter the amount you want to withdraw in Leones (Le). For example: 10';
}

export async function withdrawNumberMessageTemplate(mobile) {
  return {
    body: {
      text: 'Are you withdrawing to your own number or a different number?',
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Self',
          id: 'self',
        },
        {
          type: 'quick_reply',
          title: 'Different number',
          id: 'different_number',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function withdrawDifferentNumberMessageTemplate() {
  return 'Enter the phone number you want to withdraw funds to (e.g., +232123456789):';
}

export async function withdrawConfirmMessageTemplate(name, mobile, withdrawing_number, amount) {
  return {
    header: {
      text: 'Confirm Withdrawal',
    },
    body: {
      text: `Hi ${name}, you're about to withdraw funds via Mobile Money.\n\nAmount: Le ${amount}\nRecipient: ${withdrawing_number}\n\nDo you want to continue?`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Yes',
          id: 'w_confirm',
        },
        {
          type: 'quick_reply',
          title: 'Cancel',
          id: 'cancel',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function withdrawSuccessMessageTemplate(name, mobile, amount, currency) {
  return `✅ Hi ${name}, you successfully withdrew ${amount} ${currency}. The funds will be sent to your mobile money account within a few minutes.`;
}

export async function withdrawFailedMessageTemplate(name, mobile, amount, currency) {
  return `❌ Hi ${name}, your withdrawal of ${amount} ${currency} failed. Please try again later. If the problem continues, contact our support team.`;
}

//check balance
export async function checkBalanceMessageTemplate(
  name: string,
  mobile: string,
  usdc: number,
  fiat: number
) {
  return `💰 Hi ${name}, here's your current wallet balance:\n\n💵 USDC: $${usdc}\n💴 Fiat: Le ${fiat}`;
}

// Error and global command templates
export async function invalidSelectionMessageTemplate(mobile: string) {
  return {
    body: {
      text: `❌ I didn't understand that selection. Please choose from the available options.\n\n💡 Quick commands:\n• Type "menu" - Return to main menu\n• Type "restart" - Start over\n• Type "help" - Get assistance`,
    },
    type: 'text',
    to: mobile,
  };
}

export async function helpMessageTemplate(mobile: string) {
  return {
    body: {
      text: `🆘 *Mocha Help Center*\n\n💬 *Quick Commands (type anytime):*\n• *menu* - Return to main menu\n• *restart* - Start fresh conversation\n• *help* - Show this help message\n• *cancel* - Cancel current operation\n\n💰 *What I can help you with:*\n• Deposit funds via mobile money or crypto\n• Send money instantly to WhatsApp contacts\n• Withdraw funds to your mobile money account\n• Check your wallet balance anytime\n\nNeed more assistance? Contact our support team!`,
    },
    type: 'text',
    to: mobile,
  };
}

export async function sessionResetMessageTemplate(name: string, mobile: string) {
  return {
    body: {
      text: `🔄 Session reset successfully, ${name}! Let's start fresh.\n\nHow can I help you today?`,
    },
    action: {
      list: {
        sections: [
          {
            title: 'Select an option',
            rows: [
              {
                id: 'd1',
                title: 'Deposit',
                description: 'Deposit with mobile money or crypto',
              },
              {
                id: 't1',
                title: 'Send',
                description: 'Transfer funds to any WhatsApp number',
              },
              {
                id: 'w1',
                title: 'Withdraw',
                description: 'Withdraw funds to your account',
              },
              {
                id: 'c1',
                title: 'Check Balance',
                description: 'Check your wallet balance',
              },
              {
                id: 'csoon',
                title: 'Invest in Stocks',
                description: 'Coming soon',
              },
            ],
          },
        ],
        label: 'Mocha Menu',
      },
    },
    type: 'list',
    to: mobile,
  };
}

export async function invalidAmountMessageTemplate(mobile: string) {
  return `❌ Please enter a valid amount using numbers only.\n\nExamples: 10 or 25.50\n\n💡 Type "cancel" to return to main menu.`;
}

export async function invalidPhoneNumberMessageTemplate(mobile: string) {
  return `❌ Please enter a valid phone number with country code.\n\nExample: +232123456789\n\n💡 Type "cancel" to return to main menu.`;
}

export async function operationCancelledMessageTemplate(mobile: string) {
  return `✅ Operation cancelled successfully. Returning to main menu...`;
}

export async function comingSoonMessageTemplate(featureName: string, mobile: string) {
  return {
    body: {
      text: `🚀 *${featureName}* is coming soon!\n\nWe're working hard to bring you this exciting feature. You'll be among the first to know when it's ready! 🎉\n\nIn the meantime, feel free to explore our other services.`,
    },
    footer: {
      text: `\n\nThank you for your patience! 💜`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Back to Menu',
          id: 'back_to_menu',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}




