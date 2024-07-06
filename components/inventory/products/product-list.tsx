"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { useSession } from "next-auth/react";
import { Product } from "@/types/product";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteProduct, getProducts } from "@/lib/inventory/products/utils";
import { debounce } from "lodash";

const ProductList = () => {
  const [data, setData] = useState<Array<Product>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [lastPage, setLastPage] = useState<number>(1);
  const { data: session, status } = useSession();
  const debounceSearchTransaction = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setCurrentPage(1);
      }, 1000),
    []
  );

  const searchTrans = (term: string) => {
    debounceSearchTransaction(term);
  };

  async function callProductLists(merchant_id: number, search: string) {
    const productList = await getProducts(
      String(merchant_id),
      {
        page: currentPage,
        perPage: 10,
      },
      search
    );

    setData(productList.data);
    setLastPage(productList.meta.last_page);
  }
  useEffect(() => {
    async function fetchData() {
      if (session?.user.merchant_id) {
        callProductLists(session.user.merchant_id, search);
      }
    }
    fetchData();
  }, [session?.user.merchant_id, currentPage, search]);
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
              <TableHead className=""></TableHead>
              <TableHead className="">Product Name</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Unit</TableHead>
              <TableHead className="text-right">Buy Price</TableHead>
              <TableHead className="text-right">Sell Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((e) => {
                return (
                  <TableRow key={e.product_id}>
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
                            <Link href={`/inventory/products/${e.product_id}`}>
                              Make a copy
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => {
                              deleteProduct(e.product_id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/inventory/products/${e.product_id}`}
                        className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                      >
                        {e.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">{e.qty}</TableCell>
                    <TableCell className="text-center">{e.unit}</TableCell>
                    <TableCell className="text-right">
                      <NumericFormat
                        className="text-green-400"
                        value={e.buy.buy_price}
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
                        value={e.sell.sell_price}
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

        <div className="flex items-center justify-end space-x-2 p-4">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() => currentPage >= 1 && setCurrentPage(currentPage - 1)}
            style={{ display: currentPage === 1 ? "none" : "flex" }}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={() =>
              currentPage != lastPage && setCurrentPage(currentPage + 1)
            }
            style={{
              display: currentPage === lastPage ? "none" : "flex",
            }}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
