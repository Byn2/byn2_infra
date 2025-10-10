 //@ts-nocheck

 import { lookup } from 'country-data-codes';
//const { getCountryList, lookup} = require("country-data-codes")
import converter from 'currency-exchanger-js';

// Get exchange rates from environment variables
const DEPOSIT_USD_TO_SLL_RATE = parseFloat(process.env.DEPOSIT_USD_TO_SLL_RATE || '24.5');
const WITHDRAW_USD_TO_SLL_RATE = parseFloat(process.env.WITHDRAW_USD_TO_SLL_RATE || '23.5');
const TO_CURRENCY = 'USD';

// Operation types for exchange rate calculations
type OperationType = 'deposit' | 'withdrawal' | 'general';

export async function getCountryCurrency(countryCode) {

  const data = lookup({ countryCode: countryCode });

  return data.currency;
}

export async function currencyConverter(amount, from, to) {
  try {
    if (from === to) {
      return Number(amount);
    }
    
    let result;
    const date = new Date();
    const formattedDate = formatDateToYYYYMMDD(date);
    const numericAmount = Number(amount);

    result = await converter.convertOnDate(
      numericAmount,
      from,
      to,
      new Date(formattedDate)
    );

    return result;
  } catch (error) {
    // If conversion fails, return the original amount as fallback
    return Number(amount);
  }
}

export async function convertToUSD(amount, fromCurrency, operationType: OperationType = 'general') {
  let result;
  const date = new Date();
  const formattedDate = formatDateToYYYYMMDD(date);
  const numericAmount = Number(amount);

  if (fromCurrency === 'SLL') {
    // Use appropriate rate based on operation type
    const rate = operationType === 'deposit' ? DEPOSIT_USD_TO_SLL_RATE : WITHDRAW_USD_TO_SLL_RATE;
    result = (numericAmount / rate);
  } else {
    result = await converter.convertOnDate(
      numericAmount,
      fromCurrency,
      TO_CURRENCY,
      new Date(formattedDate)
    );
  }

  return result;
}

export async function convertFromUSD(amount, toCurrency, operationType: OperationType = 'withdrawal') {
  let result;
  const date = new Date();
  const formattedDate = formatDateToYYYYMMDD(date);
  const numericAmount = Number(amount);

  if (toCurrency === 'SLL') {
    // Use appropriate rate based on operation type
    const rate = operationType === 'withdrawal' ? WITHDRAW_USD_TO_SLL_RATE : DEPOSIT_USD_TO_SLL_RATE;
    result = numericAmount * rate;
  } else {
    result = await converter.convertOnDate(
      numericAmount,
      TO_CURRENCY,
      toCurrency,
      new Date(formattedDate)
    );
  }

  return result;
}

function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function formatNumber(num) {
  return Math.floor(num).toLocaleString('en-US');
}


export const determineTier = (amount) => {
  if (amount <= 5000) return { tier: 'basic', rate: 0.03 };
  if (amount <= 25000) return { tier: 'crypto', rate: 0.05 };
  return { tier: 'pro', rate: 0.07 };
};