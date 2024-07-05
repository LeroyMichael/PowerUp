import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getWallets } from "@/lib/wallets/utils";
import { Purchase } from "@/types/purchase";
import { Wallet } from "@/types/wallet";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function PurchasePaymentMethod() {
  const { data: session } = useSession();

  const {
    control,
    formState: { errors },
  } = useFormContext<Purchase>();

  const paymentMethods = [
    { text: "Cash", value: "CASH" },
    { text: "Transfer", value: "TRANSFER" },
  ];

  const [walletLists, setWalletLists] = useState<Array<Wallet>>([]);

  async function callWallets() {
    const wallets = await getWallets(session?.user.merchant_id);

    setWalletLists(wallets);
  }

  useEffect(() => {
    if (session?.user.merchant_id) {
      callWallets();
    }
  }, [session?.user.merchant_id]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="mt-4">
          <FormField
            control={control}
            name="payment_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Payment Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((paymentMethod) => {
                      return (
                        <SelectItem
                          key={paymentMethod.value}
                          value={paymentMethod.value.toString()}
                        >
                          {paymentMethod.text}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage className="absolute" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="wallet_id"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Wallet</FormLabel>
                <Select
                  onValueChange={(e) => field.onChange(Number(e))}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Wallet" />
                  </SelectTrigger>
                  <SelectContent>
                    {walletLists.map((wallet) => {
                      return (
                        <SelectItem
                          key={wallet.wallet_id}
                          value={wallet.wallet_id.toString()}
                        >
                          {wallet.wallet_name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {errors.wallet_id?.message && (
                  <p className="text-red-500">Please select Wallet</p>
                )}
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </>
  );
}
