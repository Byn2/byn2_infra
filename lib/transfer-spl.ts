//@ts-nocheck
import { getOrCreateUserTokenAccount, prepareUSDCAccount } from './solana';
import { transfer } from '@solana/spl-token';
import { Connection, clusterApiUrl, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import BigNumber from 'bignumber.js';

// Initialize Solana variables only if environment variables are available
let cluster: string | undefined;
let connection: Connection | undefined;
let byn2_keypair: string | undefined;
let MINT: PublicKey | undefined;
let TOKEN_ACCOUNT: PublicKey | undefined;
let keypair: Keypair | undefined;

try {
  cluster = process.env.CONNECTION_URL;

  if (cluster) {
    connection = new Connection(clusterApiUrl(cluster), 'confirmed');
  }

  byn2_keypair = process.env.BYN2_SECRET_KEY;

  if (process.env.USDC_MINT) {
    MINT = new PublicKey(process.env.USDC_MINT);
  }

  if (process.env.USDC_TOKEN_ACCOUNT) {
    TOKEN_ACCOUNT = new PublicKey(process.env.USDC_TOKEN_ACCOUNT);
  }

  if (byn2_keypair) {
    keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(byn2_keypair)));
  }
} catch (error) {
  console.warn('Solana transfer configuration failed, some features may not work:', error);
}

export async function transferUSDC(fromNumber, toNumber, amount) {
  if (!connection || !keypair) {
    throw new Error('Solana configuration not properly initialized');
  }

  console.log('Transfer USDC from', fromNumber, 'to', toNumber, 'amount', amount);
  try {
    const fromUserAccount = await getOrCreateUserTokenAccount(fromNumber);
    const toUserAccount = await getOrCreateUserTokenAccount(toNumber);

    let parsedAmount = Math.floor(new BigNumber(amount).multipliedBy(10 ** 6).toNumber());

    await transfer(
      connection,
      keypair,
      fromUserAccount,
      toUserAccount,
      keypair,
      parsedAmount,
      undefined,
      {
        skipPreflight: true,
        commitment: 'processed',
      }
    );
  } catch (err) {
    throw new Error('Error occurred during transfer: ' + err);
  }
}

export async function makeDeposit(toNumber, amount) {
  if (!connection || !keypair || !TOKEN_ACCOUNT) {
    throw new Error('Solana configuration not properly initialized');
  }

  try {
    const toUserAccount = await getOrCreateUserTokenAccount(toNumber);

    //let parsedAmount = Math.round(new BigNumber(amount).multipliedBy(10 ** 6).toNumber());
    let parsedAmount = Math.floor(new BigNumber(amount).multipliedBy(10 ** 6).toNumber());

    await transfer(
      connection,
      keypair,
      TOKEN_ACCOUNT,
      toUserAccount,
      keypair,
      parsedAmount,
      undefined,
      {
        skipPreflight: true,
        commitment: 'processed',
      }
    );
  } catch (error) {
    throw new Error('Error occurred during deposit: ');
  }
}

export async function makeWithdraw(fromNumber, amount) {
  if (!connection || !keypair || !TOKEN_ACCOUNT) {
    throw new Error('Solana configuration not properly initialized');
  }

  try {
    const fromUserAccount = await getOrCreateUserTokenAccount(fromNumber);

    //let parsedAmount = Math.round(new BigNumber(amount).multipliedBy(10 ** 6).toNumber());
    let parsedAmount = Math.floor(new BigNumber(amount).multipliedBy(10 ** 6).toNumber());

    await transfer(
      connection,
      keypair,
      fromUserAccount,
      TOKEN_ACCOUNT,
      keypair,
      parsedAmount,
      undefined,
      {
        skipPreflight: true,
        commitment: 'processed',
      }
    );
  } catch (error) {
    throw new Error('Error occurred during withdraw: ');
  }
}

export async function sendUSDC(fromNumber, pubKey, amount) {
  if (!connection || !keypair) {
    throw new Error('Solana configuration not properly initialized');
  }

  try {
    const fromUserAccount = await getOrCreateUserTokenAccount(fromNumber);
    const receiverAccount = await prepareUSDCAccount(pubKey);

    // let parsedAmount = new BigNumber(amount).multipliedBy(10 ** 6).toNumber();

    let parsedAmount = Math.floor(new BigNumber(amount).multipliedBy(10 ** 6).toNumber());

    await transfer(
      connection,
      keypair,
      fromUserAccount,
      receiverAccount,
      keypair,
      parsedAmount,
      undefined,
      {
        skipPreflight: true,
        commitment: 'processed',
      }
    );
  } catch (error) {
    console.error('Error occurred during transfer: ', error);
    throw new Error('Error occurred during transfer: ');
  }
}

export async function retrieveUSDC(fromNumber, amount) {
  if (!connection || !keypair || !TOKEN_ACCOUNT) {
    throw new Error('Solana configuration not properly initialized');
  }

  try {
    // Get the user's USDC token account
    const userTokenAccount = await getOrCreateUserTokenAccount(fromNumber);

    // Parse the amount to the correct format
    let parsedAmount = new BigNumber(amount).multipliedBy(10 ** 6).toNumber();

    // Transfer tokens from user's account to the main USDC account
    await transfer(
      connection,
      keypair,
      userTokenAccount, // Source: User's USDC token account
      TOKEN_ACCOUNT, // Destination: Main USDC token account
      keypair, // Authority (the wallet owning both accounts)
      parsedAmount, // Amount to transfer
      undefined, // Optional multi-signature authority
      {
        skipPreflight: true,
        commitment: 'processed',
      }
    );

    console.log(`Successfully transferred ${amount} USDC from user account to main account.`);
  } catch (error) {
    console.error('Error occurred during USDC retrieval: ', error.message);
  }
}
