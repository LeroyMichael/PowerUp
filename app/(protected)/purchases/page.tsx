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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { activatePurchase, deletePurchase, getPurchasesLists, payPurchase } from "@/lib/purchase/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { debounce } from "lodash";
import { PlusCircle, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
const PurchasesPage = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [ search, setSearch ] = useState<string>("")
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ lastPage, setLastPage ] = useState<number>(1)

  const router = useRouter()

  const debounceSearchTransaction = useMemo(() => 
    debounce((value: string) => {
      setSearch(value)
      setCurrentPage(1)
    }, 1000
  ),[])

  const searchTrans = (term: string) => {
    debounceSearchTransaction(term)
  };

  async function callPurchaseLists(merchant_id: number, currentPage: number, search: string){

    const purchaseLists = await getPurchasesLists(merchant_id, currentPage, search) 

    setData(purchaseLists.data)
    setLastPage(purchaseLists.meta.last_page)
  }

  async function callActivatePurchase(purchase_id: number){
    await activatePurchase(purchase_id)
      .then(() => callPurchaseLists(session?.user.merchant_id, currentPage, search))
  }

  async function markAsPaidPurchase(purchase_id: number, isActive: boolean){

    if(isActive){
      await payPurchase(purchase_id)
        .then(() => callPurchaseLists(session?.user.merchant_id, currentPage, search))

      return
    }

    await activatePurchase(purchase_id)
      .then(() => payPurchase(purchase_id))
      .then(() => callPurchaseLists(session?.user.merchant_id, currentPage, search))
  }

  useEffect(() => {
    if(session?.user.merchant_id){
      callPurchaseLists(session.user.merchant_id, currentPage, search)
    }
  }, [session?.user.merchant_id, currentPage, search])

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
                  <TableCell className="w-5"></TableCell>
                  <TableCell className="">Date</TableCell>
                  <TableCell className="">Purchase Number</TableCell>
                  <TableCell>Vendor</TableCell>
                  <TableCell className="">Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment Status</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data ? (
                  data.map((item, idx) => {
                    return (
                      <TableRow key={idx}>
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
                              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/purchases/${item.purchase_id}`)}>
                                  Make a copy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  deletePurchase(item.purchase_id);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => callActivatePurchase(item.purchase_id)}
                                disabled={item.status === "ACTIVE"}
                              >
                                Activate
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => markAsPaidPurchase(item.purchase_id, item.status === "ACTIVE")}
                                disabled={item.payment_status === "PAID"}
                              >
                                  Mark as paid
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>{item.transaction_date}</TableCell>
                        <TableCell className="font-medium">
                          <Link
                            href={"/purchases/[purchase]"}
                            as={`/purchases/${item.purchase_id}`}
                            className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                          >
                            {item.transaction_number}
                          </Link>
                        </TableCell>
                        <TableCell className="capitalize">{item.contact_name?.first_name}</TableCell>
                        <TableCell>{item.due_date}</TableCell>
                        <TableCell>
                          <Badge
                            variant={item.status === "ACTIVE" ? "paid" : "draft"}
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={item.payment_status === "PAID" ? "paid" : "draft"}
                          >
                            {item.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-left">
                          <NumericFormat
                            className="text-green-400"
                            value={item.total}
                            displayType={"text"}
                            prefix={"Rp"}
                            allowNegative={false}
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
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  currentPage >= 1 &&
                  setCurrentPage(currentPage - 1)
                }
                style={{ display: currentPage === 1 ? "none" : "flex" }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  currentPage != lastPage &&
                  setCurrentPage(currentPage + 1)
                }
                style={{
                  display:
                    currentPage === lastPage ? "none" : "flex",
                }}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasesPage;
