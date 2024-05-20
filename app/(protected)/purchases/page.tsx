"use client";
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { CaseUpper, PlusCircle, Search, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
const PurchasesPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [temp, setTemp] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  function deleteTransaction(transactionId: String) {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/transactions/${transactionId}`, {
      method: "DELETE",
    }).catch((error) => console.log("error", error));
  }
  const searchTrans = (term: string) => {
    setData(temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term)));
  };
  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex w-100 justify-between items-center">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Purchases</CardTitle>
            <CardDescription>List of purchases</CardDescription>
          </div>
          <div>
            <Button size="sm" className="h-8 gap-1">
              <Link href="/purchases/new" className="flex items-center gap-2">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Create Purchase
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
                  <TableHead className="w-5"></TableHead>
                  <TableHead className="">Date</TableHead>
                  <TableHead className="">Purchase Number</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="">Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Balance Due</TableHead>
                  <TableHead>Total</TableHead>
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
                                  href={`/transactions/transaction-/${e.transaction_id}`}
                                >
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

export default PurchasesPage;
