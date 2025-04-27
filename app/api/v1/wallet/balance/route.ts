import * as walletService from "@/services/wallet_service";
import * as currecyService from "@/services/currency_service";
import { convertFromUSD } from "@/lib/helpers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/middleware/verifyTokenApp";

export async function GET(request: Request) {
  const auth = await verifyToken(request);

  if ("user" in auth === false) return auth;
 
  try {
    const currency = await currecyService.getCurrency(auth.user);

    const wallet = await walletService.getWalletBalance(auth.user);
    const fiat = await convertFromUSD(wallet.balance, currency);

    return NextResponse.json({
      wallet: { usdc: wallet.balance, fiat: fiat, address: wallet.address },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
