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
}

const SaleMobilePagePaymentComponent = ({
  activeComponent,
  setActiveComponent,
  productList,
  totalPrice,
}: Props) => {
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
  
  const handleCreatePaid = () => {
    alert("Created paid! (mock only)")
  }

  const handleCreateUnpaid = () => {
    alert("Created Unpaid! (mock only)")
  }
  
  console.log("ASDASDASDASD = ", wallets);
  return (
    <>
      <div
        className="min-h-[89vh] "
        style={{ display: activeComponent == 3 ? "block" : "none" }}
      >
        <div className="grid gap-4">
          <div
            className="rounded-md border mb-3"
            style={{ display: activeComponent == 3 ? "block" : "none" }}
          >
            <Table>
              <TableBody>
                {wallets ? (
                  wallets.map((w, index) => {
                    return (
                      <TableRow key={w.wallet_id}>
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
        </div>
        <div className="px-4 w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-12 gap-4">
          <Button onClick={() => setActiveComponent(2)} className="col-span-2">
            <ArrowLeft color="#ffffff" />
          </Button>
          <Button
            onClick={() => handleCreatePaid()}
            className="col-span-5"
          >
            Create Paid
          </Button>
          <Button
            onClick={() => handleCreateUnpaid()}
            className="col-span-5"
          >
            Create Unpaid
          </Button>
        </div>
      </div>
    </>
  );
};

export default SaleMobilePagePaymentComponent;
