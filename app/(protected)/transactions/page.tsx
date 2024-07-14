"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteTransaction,
  getTransactions,
  payTransaction,
} from "@/lib/transaction/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { CaseUpper, PlusCircle, Search, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

const TransactionsPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (session?.user.merchant_id) {
      callTransactionLists();
    }
  }, [session?.user]);

  async function callTransactionLists() {
    await getTransactions(session?.user.merchant_id)
      .then((res) => {
        setData(res);
        setTemp(res);
        localStorage.setItem("transactions", JSON.stringify(res));
        var map = res.reduce(function (prev: any, cur: any) {
          prev[cur.type] = (prev[cur.type] || 0) + 1;
          return prev;
        }, {});
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  }
  const searchTrans = (term: string) => {
    setData(temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term)));
  };
  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex w-100 justify-between items-center">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>List of invoices</CardDescription>
          </div>
          <div>
            <Button size="sm" className="h-8 gap-1">
              <Link
                href="/transactions/transaction-form"
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Transaction
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-8 lg:flex-row ">
        <div className="flex-1 ">
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              onChange={(e) => searchTrans(e.target.value)}
            />
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead className="">Payment Status</TableHead>
                  <TableHead className="">Transaction Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="min-w-[160px]">Date</TableHead>
                  <TableHead>Company/Customer Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Phone Number
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Address
                  </TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data ? (
                  data.map((e) => {
                    const tDetails = JSON.parse(e.details);
                    return (
                      <TableRow key={e.transaction_id}>
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
                            <DropdownMenuContent
                              align="end"
                              className="w-[160px] "
                            >
                              <DropdownMenuItem className="cursor-pointer">
                                <Link
                                  href={`/transactions/transaction-form/${e.transaction_id}`}
                                >
                                  Make a copy
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={async () => {
                                  await deleteTransaction(
                                    e.transaction_id
                                  ).then(() => callTransactionLists());
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={async () => {
                                  await payTransaction(e.transaction_id).then(
                                    () => callTransactionLists()
                                  );
                                }}
                              >
                                Paid
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Badge
                            variant={e.status == "DRAFT" ? "draft" : "paid"}
                          >
                            {e.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            href={`/transactions/transaction-form/${e.transaction_id}`}
                            className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                          >
                            {e.transaction_num}
                          </Link>
                        </TableCell>
                        <TableCell className="capitalize">{e.type}</TableCell>
                        <TableCell>{tDetails.invoiceDate}</TableCell>
                        <TableCell>
                          {e.company_name}/{e.first_name}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {e.phone_number == "" ? "-" : e.phone_number}
                        </TableCell>
                        <TableCell className="hidden md:table-cell ">
                          <p className="">
                            {e.delivery_address == ""
                              ? "-"
                              : e.delivery_address}
                          </p>
                        </TableCell>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsPage;
