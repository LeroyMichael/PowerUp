import { Wallet } from "@/types/wallet.d";

export async function getWallets(merchant_id: String): Promise<Array<Wallet>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/wallets?merchantId?${merchant_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const wallets: Array<Wallet> = data.data;
      return wallets;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export const getWallet = async (wallet_id: String): Promise<Wallet> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/wallets/${wallet_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const wallet: Wallet = data.data;
      return wallet;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
};

export const deleteWallet = async (wallet_id: String) => {
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/wallets/${wallet_id}`, {
    method: "DELETE",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const createWallet = async (data: Wallet, merchant_id: String) => {
  data.merchant_id = Number(merchant_id);
  let wallet: any = data;

  wallet.balance = wallet.balance.toString();

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wallets`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const updateWallet = async (
  data: Wallet,
  merchant_id: String,
  wallet_id: String
) => {
  data.merchant_id = Number(merchant_id);
  let wallet: any = data;

  wallet.balance = wallet.balance.toString();

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wallets/${wallet_id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};
