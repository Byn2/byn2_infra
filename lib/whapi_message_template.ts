//@ts-nocheck
export async function initialMessageTemplate(name, mobile) {
  return {
    body: {
      text: `Hi ${name}, I'm Mocha Agent — your virtual assistant. You can use me to send money, deposit via mobile money or crypto, withdraw funds, and check your wallet balance easily.`,
    },
    action: {
      buttons: [
        {
          type: 'quick_reply',
          title: 'Get Started',
          id: 'get_started',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

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

export async function mainMenuMessageTemplate(name, mobile) {
  return {
    body: {
      text: `Good Morning, ${name}! \n It's always great to hear from you. \n\n How can Mocha be of help today?`,
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

//deposit
export async function depositMethodMessageTemplate(mobile) {
  return {
    body: {
      text: `Please select the method you want to use to deposit funds.`,
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
                description: 'Deposit with mobile money',
              },
              {
                id: 'do2',
                title: 'Crypto',
                description: 'Deposit with crypto',
              },
              {
                id: 'do3',
                title: 'Bank',
                description: 'Deposit with bank',
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
      text: 'Are depositing from',
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
  return 'Please enter the amount you want to desposit in your local currency e.g 10';
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
      text: 'Tap "Copy Code" below, then dial the code on your phone to complete your mobile money deposit.',
    },
    footer: {
      text: "We'll notify you once your deposit is successful! ✅",
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
  return 'Please enter the number you want to use to deposit funds with e.g +232123456';
}

export async function mmDepositMessageTemplateUSSDDifferentNumber(mobile, ussd) {
  return {
    body: {
      text: 'Copy Payment code',
    },
    footer: {
      text: 'Copy and send the code to the number funding the transaction to complete me payment',
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

//transfer
export async function transferMessageTemplateCurrency(mobile) {
  return {
    header: {
      text: 'Select Currency',
    },
    body: {
      text: 'Select the currency you want to transfer',
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
          title: 'Local Fiat (Le currently Support)',
          id: 'tt_local',
        },
      ],
    },
    type: 'button',
    to: mobile,
  };
}

export async function transfertMessageTemplateAmountLocal() {
  return 'Please enter the amount you want to send in your local currency (Le) e.g 10';
}

export async function transfertMessageTemplateAmountUSD() {
  return 'Please enter the amount you want to send in USD ($) e.g 1';
}

export async function transferMessageTemplateNumber() {
  return 'Please enter the Whatsapp number you want to send funds to e.g +232123456';
}

export async function transferMessageTemplateConfirmLocal(name, mobile, toNumber, amount) {
  return {
    header: {
      text: 'Confirm Transaction',
    },
    body: {
      text: `Hi ${name}, you're about to make a send.\n\nAmount: Le ${amount}\nPhone Number: ${toNumber}\n\nDo you want to continue?`,
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
      text: `Hi ${name}, you're about to make a send.\n\nAmount: \$ ${amount}\nPhone Number: ${toNumber}\n\nDo you want to continue?`,
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
    return `Hi ${name}, you successfully sent ${amount} ${currency} to ${toNumber}`;
  } else {
    return `Hi ${name}, you failed to send ${amount} ${currency} to ${toNumber}. Please try again later. If the problem persists, please contact support. Thank you for using Mocha.`;
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
    return `Hi ${name}, you received ${amount} ${currency} from ${from}`;
  } else {
    return `Hi ${mobile}, you received ${amount} ${currency} from ${from}`;
  }
}

//withdraw

//check balance
export async function checkBalanceMessageTemplate(
  name: string,
  mobile: string,
  usdc: number,
  fiat: number
) {
  return `Hi ${name}, your current balance is: \n\n USDC: ${usdc} \n\n Fiat: ${fiat}`;
}
