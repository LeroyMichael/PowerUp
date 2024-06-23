"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getWallets } from "@/lib/wallets/utils";
import { Sale } from "@/types/sale.d";
import { Wallet } from "@/types/wallet.d";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

const SelectWallet = () => {
  const {
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<Sale>();

  const [wallets, setWallets] = useState<Array<Wallet>>();
  const { data: session, status } = useSession();

  useEffect(() => {
    async function fetchWallets() {
      if (session?.user.merchant_id) {
        setWallets(await getWallets(session?.user.merchant_id));
      }
    }
    fetchWallets();
  }, [session?.user]);

  return (
    <>
      <FormField
        control={control}
        name="wallet_id"
        render={({ field }) => (
          <FormItem className="">
            <FormControl>
              <Select
                onValueChange={(e) => field.onChange(Number(e))}
                value={field.value?.toString()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets?.map((wallet: Wallet) => (
                    <SelectItem
                      value={String(wallet.wallet_id)}
                      key={wallet.wallet_id}
                    >
                      {wallet.wallet_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default SelectWallet;
