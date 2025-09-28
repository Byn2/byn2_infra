//@ts-nocheck
//@ts-ignore
import { Connection, Keypair, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getOrCreateUserTokenAccount } from '../lib/solana';

// Initialize Solana variables only if environment variables are available
let cluster: string | undefined;
let mint: PublicKey | undefined;
let keypair: string | undefined;
let connection: Connection | undefined;
let byn2_keypair: Keypair | undefined;

try {
  cluster = process.env.CONNECTION_URL;

  if (process.env.USDC_MINT) {
    mint = new PublicKey(process.env.USDC_MINT);
  }

  keypair = process.env.BYN2_SECRET_KEY;

  if (cluster) {
    connection = new Connection(clusterApiUrl(cluster), 'confirmed');
  }

  if (keypair) {
    byn2_keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(keypair)));
  }
} catch (error) {
  console.warn('Solana savings service configuration failed, some features may not work:', error);
}

let LULO_API_KEY = process.env.FLEXLEND_API_KEY;

/**
 * Fetches account details from the FlexLend API.
 * @param {string} walletAddress - The wallet address to fetch the account details for.
 * @returns {Promise<object>} The account details.
 */
export async function fetchAccountDetails(user) {
  if (!LULO_API_KEY) {
    throw new Error('FlexLend API key not configured');
  }

  const walletAddress = await getOrCreateUserTokenAccount(user.mobile_number);
  const owner = new PublicKey(walletAddress);

  try {
    const response = await fetch('https://api.flexlend.fi/account', {
      method: 'GET',
      headers: {
        'x-wallet-pubkey': owner.toString(),
        'x-api-key': LULO_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching account details:', error.message);
    throw error;
  }
}

/**
 * Generates a deposit transaction for the savings account using the FlexLend API.
 * @param {Object} depositParams - Deposit parameters
 * @param {string} depositParams.owner - The wallet address of the account owner.
 * @param {string} depositParams.mintAddress - The mint address of the token to deposit.
 * @param {string} depositParams.depositAmount - The amount to deposit as a string.
 * @returns {Promise<object>} The deposit transaction details.
 */
export async function fetchDepositTransaction(user, depositAmount) {
  const walletAddress = await getOrCreateUserTokenAccount(user.mobile_number);
  const owner = new PublicKey(walletAddress);

  try {
    const response = await fetch(
      'https://api.flexlend.fi/generate/account/deposit?priorityFee=5000',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-pubkey': owner,
          'x-api-key': LULO_API_KEY,
        },
        body: JSON.stringify({
          owner,
          mint,
          depositAmount,
        }),
      }
    );

    const result = await response.json();

    console.log({ transactionMeta: result });

    return result;
  } catch (error) {
    console.log('Error fetching deposit transaction:', error);
  }
}

/**
 * Makes a deposit into the user's savings account.
 * @param {string} transaction - The transaction to make the deposit with.
 * @returns {Promise<string>} The signature of the deposit transaction.
 */
export async function makeDeposit(transaction) {
  console.log('\nMaking Deposit..');

  const rawTransaction = Buffer.from(transaction, 'base64');
  const tx = VersionedTransaction.deserialize(rawTransaction);

  console.log('🚀 ~ makeDeposit ~ tx1:', tx);
  console.log('Signing transaction w/:', byn2_keypair.toBase58());
  console.log('🚀 ~ makeDeposit ~ tx2:', tx.signatures);
  console.log('Sending signed transaction...');

  tx.sign([byn2_keypair]);

  return await connection.sendTransaction(tx);
}

export async function fetchWithdrawTransaction({ owner, mintAddress, withdrawAmount }) {}

export async function makeWithdraw(transaction) {}
