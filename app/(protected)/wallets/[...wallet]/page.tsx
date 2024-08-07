"use client";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { Textarea } from "@/components/ui/textarea";
import {
  Wallet,
  WalletDefaultValues,
  WalletSchema,
  WalletTransaction,
} from "@/types/wallet.d";
import {
  createWallet,
  getWallet,
  getWalletTransactions,
  updateWallet,
} from "@/lib/wallets/utils";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { updateLocale } from "moment";
import { WalletTransactions } from "@/components/organisms/wallet-transactions";

// async function getData(wallet_id: string, merchant_id: string) {
//   return getWallet();
// }

const WalletPage = ({ params }: { params: { wallet: string } }) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const form = useForm<Wallet>({
    resolver: zodResolver(WalletSchema),
    defaultValues: WalletDefaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: Wallet) {
    params?.wallet != "new"
      ? await updateWallet(
          data,
          session?.user.merchant_id,
          params?.wallet,
          router
        )
      : await createWallet(data, session?.user.merchant_id, router);
  }

  useEffect(() => {
    async function get() {
      params?.wallet != "new" && form.reset(await getWallet(params?.wallet));
    }
    get();
  }, [params?.wallet, session?.user]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="flex items-center gap-4 ">
            <div className="flex items-center gap-4">
              <Button
                type="reset"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {params?.wallet == "new"
                  ? "New Wallet"
                  : form.getValues("wallet_name")}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <div className="flex flex-col md:flex-row gap-5">
                <Button>
                  {params?.wallet == "new" ? "+ Add New Wallet" : "Save"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="wallet_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wallet Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Tokopedia Wallet" {...field} />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Wallet for Tokopedia"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Wallet Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="bank_info.account_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Number</FormLabel>
                          <FormControl>
                            <Input placeholder="012345" {...field} />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bank_info.bank_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="BCA" {...field} />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="balance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Balance</FormLabel>
                          <FormControl>
                            <Input
                              inputMode="numeric"
                              placeholder="100.000"
                              {...field}
                              onChange={(event) =>
                                field.onChange(
                                  isNaN(Number(event.target.value))
                                    ? ""
                                    : +event.target.value
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            <NumericFormat
                              value={field.value}
                              displayType={"text"}
                              prefix={"Rp"}
                              allowNegative={true}
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              fixedDecimalScale={true}
                            />
                          </FormDescription>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle>Transafer Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3"></div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <WalletTransactions wallet_id={params?.wallet} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Button className="md:hidden mb-10">
            {params?.wallet == "new" ? "Save" : "Add New Wallet"}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default WalletPage;
