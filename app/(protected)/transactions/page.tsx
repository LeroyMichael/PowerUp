"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { CaseUpper, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

const TransactionsPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (session?.user.merchant_id) {
      fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/transactions?merchantId=${session?.user.merchant_id}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          console.log(data);
          localStorage.setItem("transactions", JSON.stringify(data));
          var map = data.reduce(function (prev: any, cur: any) {
            prev[cur.type] = (prev[cur.type] || 0) + 1;
            return prev;
          }, {});
          localStorage.setItem("count", JSON.stringify(map));
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    }
  }, [session]);
  function deleteTransaction(transactionId: String) {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/transactions/${transactionId}`, {
      method: "DELETE",
    }).catch((error) => console.log("error", error));
  }
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Company/Customer Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead className="">Address</TableHead>
            <TableHead className="text-right">Total Price</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data ? (
            data.map((e) => {
              const tDetails = JSON.parse(e.details);
              return (
                <TableRow key={e.transaction_id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`transactionForm/${e.transaction_id}`}
                      className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                    >
                      {e.transaction_num}
                    </Link>
                  </TableCell>
                  <TableCell>{e.type}</TableCell>
                  <TableCell>{tDetails.invoiceDate}</TableCell>
                  <TableCell>
                    {tDetails.company}/{tDetails.name}
                  </TableCell>
                  <TableCell>{tDetails.telephone}</TableCell>
                  <TableCell className="">{tDetails.address}</TableCell>
                  <TableHead className="text-right">
                    <NumericFormat
                      className="text-green-400"
                      value={e.total_price}
                      displayType={"text"}
                      prefix={"Rp"}
                      allowNegative={false}
                      decimalSeparator={","}
                      thousandSeparator={"."}
                      fixedDecimalScale={true}
                    />
                  </TableHead>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px] ">
                        <DropdownMenuItem className="cursor-pointer">
                          <Link href={`transactionForm/${e.transaction_id}`}>
                            Make a copy
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            deleteTransaction(e.transaction_id);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell className="w-100 h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsPage;
