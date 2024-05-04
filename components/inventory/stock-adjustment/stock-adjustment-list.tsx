"use client";
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
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useSession } from "next-auth/react";
import { Product } from "@/types/product";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { getProduct, getProducts } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const StockAdjustmentList = () => {
  const [data, setData] = useState<Array<Product>>([]);
  const [temp, setTemp] = useState<Array<Product>>([]);
  const [isLoading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  function deleteTransaction(productId: number) {
    fetch(`${process.env.NEXT_PUBLIC_URL}/api/products/${productId}`, {
      method: "DELETE",
    }).catch((error) => console.log("error", error));
  }
  const searchTrans = (term: string) => {
    setData(temp.filter((e) => JSON.stringify(e).toLowerCase().includes(term)));
  };
  useEffect(() => {
    async function fetchData() {
      if (session?.user.merchant_id) {
        setData(await getProducts());
        console.log(data);
      }
    }
    fetchData();
  }, [data, session?.user]);
  return (
    <div>
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
              <TableHead className="">Product Name</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Minimum Stock</TableHead>
              <TableHead className="text-center">Unit</TableHead>
              <TableHead className="text-right">Buy Price</TableHead>
              <TableHead className="text-right">Sell Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((e) => {
                return (
                  <TableRow key={e.productId}>
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
                            <Link href={`/products/${e.productId}`}>
                              Make a copy
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              deleteTransaction(e.productId);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/products/${e.productId}`}
                        className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                      >
                        {e.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">{e.qty}</TableCell>
                    <TableCell className="text-center">{e.minStock}</TableCell>
                    <TableCell className="text-center">{e.unit}</TableCell>
                    <TableCell className="text-right">
                      <NumericFormat
                        className="text-green-400"
                        value={e.buy.buyPrice}
                        displayType={"text"}
                        prefix={"Rp"}
                        allowNegative={false}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        fixedDecimalScale={true}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <NumericFormat
                        className="text-green-400"
                        value={e.sell.sellPrice}
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
              })}
          </TableBody>
          {data.length == 0 && (
            <TableCaption>
              <div className="pb-4">No results found.</div>
            </TableCaption>
          )}
        </Table>
      </div>
    </div>
  );
};

export default StockAdjustmentList;
