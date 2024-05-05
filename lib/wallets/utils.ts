import { DummyWallets, Wallet } from "@/types/wallet.d";

export async function getWallets() {
  return null;
}

export const getWallet = async (wallet_id: string, merchant_id: string) => {
  const res = await fetch("");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const wallets: Array<Wallet> = DummyWallets;
  wallets.find((e: Wallet) => (e.wallet_id = Number(wallet_id)));
  return wallets.find((e: Wallet) => (e.wallet_id = Number(wallet_id)));
};
