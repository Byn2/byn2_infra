//@ts-check
import {
  TOKEN_PROGRAM_ID,
  createInitializeAccount3Instruction,
  getAccount,
  getAssociatedTokenAddress,
  createAssociatedTokenAccount,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  clusterApiUrl,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

const cluster = process.env.CONNECTION_URL;
// @ts-ignore
const mint = new PublicKey(process.env.USDC_MINT);
const byn2_keypair = process.env.BYN2_SECRET_KEY;
// @ts-ignore
const connection = new Connection(clusterApiUrl(cluster), 'confirmed');
// @ts-ignore
let keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(byn2_keypair)));

export async function getOrCreateUserTokenAccount(phoneNumber) {
  const address = await PublicKey.createWithSeed(
    keypair.publicKey,
    phoneNumber,
    TOKEN_PROGRAM_ID
  );

  let account;

  try {
    account = await getAccount(connection, address, 'processed');
  } catch (error) {
    const accountWithSeedIx = await createAccountWithSeed(
      keypair.publicKey,
      phoneNumber,
      address
    );

    const initializedAccountIx = createInitializeAccount3Instruction(
      address,
      mint,
      keypair.publicKey
    );

    const tx = new Transaction().add(accountWithSeedIx, initializedAccountIx);
    await sendAndConfirmTransaction(connection, tx, [keypair], {
      skipPreflight: true,
      commitment: 'processed',
    }).catch((error) => console.log(error));
  }

  return (await getAccount(connection, address, 'processed')).address;
}

async function createAccountWithSeed(basePubKey, seed, newAccountPubkey) {
  const space = 165; // size of a token account
  const lamports = await connection.getMinimumBalanceForRentExemption(space);
  const ix = SystemProgram.createAccountWithSeed({
    fromPubkey: basePubKey,
    basePubkey: basePubKey,
    seed,
    newAccountPubkey,
    lamports,
    space,
    programId: TOKEN_PROGRAM_ID,
  });

  return ix;
}

export async function prepareUSDCAccount(pubKey) {
  const address = new PublicKey(pubKey);

  try {
    const account = await getAssociatedTokenAddress(mint, address);

    const accountInfo = await getAccount(connection, account);

    return account;
  } catch (error) {
    const ataTransaction = await createAssociatedTokenAccount(
      connection,
      keypair, // Payer
      mint, // USDC Mint address
      address // Recipient's public key
    );

    const account = await getAssociatedTokenAddress(mint, address);

    return account;
  }
}
