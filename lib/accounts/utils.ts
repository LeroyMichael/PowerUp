import { toast } from "@/components/ui/use-toast";
import { Account } from "@/types/account";
export type TGetAccountsParams = {
  merchant_id: number;
};
export async function getAccounts(filter: TGetAccountsParams) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/accounts?merchant_id=${filter.merchant_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const accounts: Array<Account> = data.data;
      return accounts;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export const createContact = async (
  data: Account,
  merchant_id: String,
  router: any
) => {
  data.merchant_id = Number(merchant_id);
  let account: any = data;

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/accounts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(account),
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
    description: "Your account has been submitted.",
  });
  router.push("/accounts");
};
