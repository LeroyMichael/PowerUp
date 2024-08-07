import { NumericFormat } from "react-number-format";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import moment from "moment";
import { useEffect, useState } from "react";
import { WalletTransaction } from "@/types/wallet";
import { getWalletTransactions } from "@/lib/wallets/utils";

export function WalletTransactions(props: { wallet_id: String }) {
  const [walletTransactions, setWalletTransactions] = useState<
    Array<WalletTransaction>
  >([]);

  useEffect(() => {
    async function get() {
      setWalletTransactions(await getWalletTransactions(props.wallet_id));
    }
    get();
  }, [props.wallet_id]);
  return (
    <div className="space-y-8">
      {walletTransactions.map((transaction: WalletTransaction) => {
        return (
          <div
            className="flex items-center"
            key={transaction.wallet_transaction_id}
          >
            <div className="space-y-1 text-center mr-4">
              <p className="text-sm font-medium leading-none">
                {moment(transaction.created_at).format("DD")}
              </p>
              <p className="text-sm">
                {moment(transaction.created_at).format("MMM")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction.transaction_type}
              </p>
              <p className="text-sm text-muted-foreground">
                {transaction.process_label}
              </p>
            </div>
            <div className="flex flex-col ml-auto font-medium text-right text-muted-foreground text-sm">
              <>
                {transaction.transaction_type == "INCOME" ? (
                  <NumericFormat
                    className="text-green-400"
                    value={transaction.amount}
                    displayType={"text"}
                    prefix={"+Rp"}
                    allowNegative={false}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    fixedDecimalScale={true}
                  />
                ) : (
                  <NumericFormat
                    className="text-red-400"
                    value={transaction.amount}
                    displayType={"text"}
                    prefix={"-Rp"}
                    allowNegative={false}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    fixedDecimalScale={true}
                  />
                )}
              </>
            </div>
          </div>
        );
      })}
    </div>
  );
}
