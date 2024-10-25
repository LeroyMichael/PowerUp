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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteProduct, getProducts } from "@/lib/inventory/products/utils";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";

export type TInventoryTabProps = {
  onSearch: (value: string) => void;
  onChangePagination: (value: number) => void;
  filter: {
    search: string;
    page: number;
    perPage: number;
  };
};

const ProductList = ({
  onSearch,
  onChangePagination,
  filter,
}: TInventoryTabProps) => {
  const [data, setData] = useState<Array<Product>>([]);
  const { data: session } = useSession();

  // TODO: Fix this hack way to get lastPage from getProducts api function, getProducts needs to return lastPage etc.
  const [lastPage, setLastPage] = useState(1);

  const [sell, setSell] = useState(false);
  const [buy, setBuy] = useState(false);
  const [all, setAll] = useState(true);
  async function fetchData(a: boolean, b: boolean, s: boolean) {
    if (session?.user.merchant_id) {
      const temp = {
        merchant_id: session?.user.merchant_id,
        pageParam: { page: filter.page, perPage: filter.perPage },
        search: filter.search,
        setLastPage: setLastPage,
      };
      const resp = await getProducts(
        a
          ? temp
          : {
              ...temp,
              sell: s,
              buy: b,
            }
      );
      setData(resp);
    }
  }
  useEffect(() => {
    fetchData(all, buy, sell);
  }, [session?.user.merchant_id, filter]);

  function allOnChange(value: boolean) {
    setAll(value);
    value && setSell(false), setBuy(false);
    fetchData(value, false, false);
  }
  function sellOnChange(value: boolean) {
    setSell(value);
    if (value) {
      setAll(false);
    }
    fetchData(false, buy, value);
  }
  function buyOnChange(value: boolean) {
    setBuy(value);
    if (value) {
      setAll(false);
    }
    fetchData(false, value, sell);
  }

  return (
    <div>
      <div className="relative mb-4 flex gap-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-8 w-5/6"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Toggle
          variant="outline"
          aria-label="Toggle bold"
          pressed={all}
          onPressedChange={allOnChange}
        >
          All
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="Toggle bold"
          pressed={sell}
          onPressedChange={sellOnChange}
        >
          Sell
        </Toggle>
        <Toggle
          variant="outline"
          aria-label="Toggle bold"
          pressed={buy}
          onPressedChange={buyOnChange}
        >
          Buy
        </Toggle>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className=""></TableHead>
              <TableHead className="">Product Name</TableHead>
              <TableHead className="text-center">Qty</TableHead>
              <TableHead className="text-center">Unit</TableHead>
              <TableHead className="text-center">Sale & Buy</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Latest Buy Price</TableHead>
              <TableHead className="text-right">Sell Price</TableHead>
              <TableHead className="text-right">Avg Price</TableHead>
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
                    <TableCell className="text-center">
                      {e.sell.is_sell && "Sale"}
                      {e.sell.is_sell && e.buy.is_buy && ","}
                      {e.buy.is_buy && "Buy"}
                    </TableCell>
                    <TableCell className="text-center ">
                      <Badge variant={e.is_hide_product ? "draft" : "paid"}>
                        {e.is_hide_product ? "Hidden" : "Active"}
                      </Badge>
                    </TableCell>
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
                    <TableCell className="text-right">
                      <NumericFormat
                        className="text-green-400"
                        value={e.buy.average_buy_price}
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
      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() =>
            filter.page >= 1 && onChangePagination(filter.page - 1)
          }
          style={{ display: filter.page === 1 ? "none" : "flex" }}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() =>
            filter.page != lastPage && onChangePagination(filter.page + 1)
          }
          style={{
            display: filter.page === lastPage ? "none" : "flex",
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
