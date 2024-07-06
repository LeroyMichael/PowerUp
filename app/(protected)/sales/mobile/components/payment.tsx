"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getWallets } from "@/lib/wallets/utils";
import { Wallet } from "@/types/wallet.d";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
interface ShoppingList {
  id: number;
  name: string;
  qty: number;
  price: number;
}

interface Props {
  productList: any;
  totalPrice: number;
  activeComponent: number;
  setActiveComponent: (arg0: number) => void;
  form: any;
  handleSubmit: (arg0: any) => void;

  onSubmitPaid: (arg0: any) => void;
  onSubmitUnpaid: (arg0: any) => void;
}

const SaleMobilePagePaymentComponent = ({
  activeComponent,
  setActiveComponent,
  productList,
  totalPrice,
  form,
  onSubmitPaid,
  onSubmitUnpaid,
}: Props) => {
  const [wallets, setWallets] = useState<Array<Wallet>>();
  const { data: session, status } = useSession();
  const [selectedWallet, setSelectedWallet] = useState(0);

  const handleSelectWallet = (id: number) => {
    setSelectedWallet(id);
    form.setValue("wallet_id", id);
  };
  useEffect(() => {
    async function fetchWallets() {
      if (session?.user.merchant_id) {
        const temp = await getWallets(session?.user.merchant_id);
        if (!temp) return null;
        setWallets(temp);
        setSelectedWallet(temp[0].wallet_id);
        form.setValue("wallet_id", temp[0].wallet_id);
      }
    }
    fetchWallets();
  }, [session?.user]);

  // const handleCreatePaid = () => {
  //   alert("Created paid! (mock only)")
  // }

  // const handleCreateUnpaid = () => {
  //   alert("Created Unpaid! (mock only)")
  // }

  return (
    <>
      <div
        className="min-h-[89vh] "
        style={{ display: activeComponent == 3 ? "block" : "none" }}
      >
        <Card>
          <div className="grid gap-4">
            <CardHeader>
              <CardTitle>Select Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="rounded-md border mb-3"
                style={{ display: activeComponent == 3 ? "block" : "none" }}
              >
                <Table>
                  <TableBody>
                    {wallets ? (
                      wallets.map((w, index) => {
                        return (
                          <TableRow
                            className={cn(
                              w.wallet_id == selectedWallet
                                ? "bg-muted"
                                : "bg-white"
                            )}
                            key={w.wallet_id}
                            onClick={() => handleSelectWallet(w.wallet_id)}
                          >
                            <TableCell className="capitalize">
                              {index + 1}
                            </TableCell>
                            <TableCell className="capitalize">
                              {w.wallet_name}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell className="w-100 h-24 text-center">
                          No item.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </div>
        </Card>
        <div className="px-4 w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-12 gap-4">
          <Button
            onClick={() => setActiveComponent(2)}
            className="col-span-2"
            type="button"
          >
            <ArrowLeft color="#ffffff" />
          </Button>
          <Button
            // onClick={() => handleCreatePaid()}
            className="col-span-5"
            onClick={() => onSubmitPaid(form.getValues())}
            type="button"
          >
            Create Paid
          </Button>
          <Button
            onClick={() => onSubmitUnpaid(form.getValues())}
            className="col-span-5"
            type="button"
          >
            Create Unpaid
          </Button>
        </div>
      </div>
    </>
  );
};

export default SaleMobilePagePaymentComponent;
