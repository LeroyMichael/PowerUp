"use client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  activateSale,
  deleteSale,
  getSales,
  paidSale,
} from "@/lib/sales/utils";
import { Sale } from "@/types/sale.d";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  CaseUpper,
  PlusCircle,
  Search,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";

const SalesPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [temp, setTemp] = useState<Array<Sale>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(true);

  const searchTrans = (term: string) => {
    setData(temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term)));
  };
  async function get() {
    if (session?.user.merchant_id) {
      const res = await getSales(session?.user.merchant_id, currentPage);
      setLastPage(res.meta.last_page);
      setData(res.data);
      setTemp(res.data);
    }
  }
  useEffect(() => {
    get();
  }, [session?.user, currentPage]);

  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex w-100 justify-between items-center">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Sales</CardTitle>
            <CardDescription>List of sales</CardDescription>
          </div>
          <div className="flex justify-center">
            <Button size="sm" className="h-8 gap-1 mr-2">
              <Link href="/sales/mobile" className="flex items-center gap-2">
                <Smartphone className="w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Quick Sale
                </span>
              </Link>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Link href="/sales/new" className="flex items-center gap-2">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Sale
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
                  <TableHead>Date</TableHead>
                  <TableHead>Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Current Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data ? (
                  data.map((e) => {
                    return (
                      <TableRow key={e.sale_id}>
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
                                <Link href={`/sales/${e.sale_id}`}>
                                  Make a copy
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={async () => {
                                  await deleteSale(e.sale_id.toString());
                                  get();
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={
                                  e.status == "DRAFT"
                                    ? "cursor-pointer text-black"
                                    : "cursor-not-allowed text-slate-400 hover:text-slate-400 focus:text-slate-400"
                                }
                                onClick={async () => {
                                  e.status == "DRAFT" &&
                                    (await activateSale(
                                      e.sale_id.toString()
                                    ).then(() => get()));
                                }}
                              >
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className={
                                  e.payment_status == "UNPAID"
                                    ? "cursor-pointer text-black"
                                    : "cursor-not-allowed text-slate-400 hover:text-slate-400 focus:text-slate-400"
                                }
                                onClick={async () => {
                                  e.status == "DRAFT" &&
                                    (await activateSale(
                                      e.sale_id.toString()
                                    ).then(
                                      async () =>
                                        await paidSale(
                                          e.sale_id.toString()
                                        ).finally(() => get())
                                    ));

                                  await paidSale(e.sale_id.toString()).finally(
                                    () => get()
                                  );
                                }}
                              >
                                Mark as Paid
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell className="capitalize">
                          {e.transaction_date}
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            href={`/sales/${e.sale_id}`}
                            className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                          >
                            {e.transaction_number}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">
                          <Link
                            href={`/sales/${e.sale_id}`}
                            className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                          >
                            {e.contact_name?.contact_type} -{" "}
                            {e.contact_name?.first_name}
                          </Link>
                        </TableCell>
                        <TableCell className="capitalize">
                          {e.due_date}
                        </TableCell>
                        <TableCell className="capitalize">
                          <Badge
                            variant={e.status == "DRAFT" ? "draft" : "paid"}
                          >
                            {e.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          <Badge
                            variant={
                              e.payment_status == "UNPAID" ? "draft" : "paid"
                            }
                          >
                            {e.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <NumericFormat
                            value={e.total}
                            displayType={"text"}
                            prefix={"Rp"}
                            allowNegative={true}
                            decimalSeparator={","}
                            thousandSeparator={"."}
                            fixedDecimalScale={true}
                          />
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
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{ display: currentPage == 1 ? "none" : "flex" }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === lastPage}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPage;
