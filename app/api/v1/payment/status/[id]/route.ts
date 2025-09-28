import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Transaction from "@/models/transaction"
import { verifyToken } from "@/lib/middleware/verifyTokenApp";
import * as walletService from "@/services/wallet_service";
import { convertFromUSD } from "@/lib/helpers";
import * as currecyService from "@/services/currency_service";

export async function GET(req: NextRequest) {
  const auth = await verifyToken(req);
    if ("user" in auth === false) return auth;
  try {
    const id = req.url.split("/").pop()

    if (!id) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 })
    }

    await connectDB()

    // Find the transaction
    const transaction = await (Transaction as any).findById(id)
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }
    const currency = await currecyService.getCurrency(auth.user);
    const wallet = await walletService.getWalletBalance(auth.user);
    const fiat = await convertFromUSD(wallet.balance, currency);

    const customer = {
      user: auth.user,
      wallet: { usdc: wallet.balance, fiat: fiat, address: wallet.address },
    }

    return NextResponse.json({
      transaction,
      customer
    })
  } catch (error) {
    console.error("Transaction status error:", error)
    return NextResponse.json({ error: "Failed to fetch transaction status" }, { status: 500 })
  }
}
