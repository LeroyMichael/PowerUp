import { Wallet, WalletTransaction, WalletTransfer } from "@/types/wallet.d";
import { numberFixedToString } from "../utils";
import { toast } from "@/components/ui/use-toast";

export async function getWallets(merchant_id: String): Promise<Array<Wallet>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/wallets?merchant_id=${merchant_id}`,
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

export async function getWalletTransactions(wallet_id: String) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/wallets/${wallet_id}/history`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const walletTransactions: Array<WalletTransaction> = data.data;
      return walletTransactions;
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
      wallet.balance = Number(data.data.balance);
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

export const createWallet = async (
  data: Wallet,
  merchant_id: String,
  router: any
) => {
  data.merchant_id = Number(merchant_id);
  let wallet: any = data;

  wallet.balance = numberFixedToString(data.balance);

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/wallets`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });
  if (response === null) return null;
  toast({
    description: "Your wallet has been submitted.",
  });
  router.push("/wallets");
};

export const updateWallet = async (
  data: Wallet,
  merchant_id: String,
  wallet_id: String,
  router: any
) => {
  data.merchant_id = Number(merchant_id);
  let wallet: any = data;

  wallet.balance = numberFixedToString(data.balance);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/wallets/${wallet_id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      redirect: "follow",
    }
  )
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });
  if (response === null) return null;
  toast({
    description: "Your wallet has been updated.",
  });
  router.push("/wallets");
};
export const transferWallet = async (
  walletTransfer: WalletTransfer,
  router: any
) => {
  // Adjust From wallet
  const from_wallet = {
    currency_code: "IDR",
    delta: numberFixedToString(-walletTransfer.amount),
    process_label: `transfer to ${walletTransfer.to_wallet_name}`,
    source_id: walletTransfer.from_wallet_id,
  };
  const to_wallet = {
    ...from_wallet,
    process_label: `transfer from ${walletTransfer.from_wallet_name}`,
    delta: numberFixedToString(walletTransfer.amount),
  };
  fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/wallets/${walletTransfer.from_wallet_id}/adjust-balance`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(from_wallet),
      redirect: "follow",
    }
  )
    .then(() =>
      // Adjust To wallet
      fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/wallets/${walletTransfer.to_wallet_id}/adjust-balance`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(to_wallet),
          redirect: "follow",
        }
      )
    )
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  toast({
    description: "Balance has been transfered",
  });
};
