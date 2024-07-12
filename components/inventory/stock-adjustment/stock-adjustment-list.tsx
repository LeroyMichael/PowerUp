"use client"

import { Input } from "@/components/ui/input";
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
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getStockAdjustments } from "@/lib/inventory/stock-adjustment/utils";
import { StockAdjustment } from "@/types/stock-adjustment";
import { TInventoryTabProps } from "../products/product-list";
import { Button } from "@/components/ui/button";

const StockAdjustmentList = ({ onSearch, onChangePagination, filter}:TInventoryTabProps) => {
  const [data, setData] = useState<Array<StockAdjustment>>([]);

  const { data: session } = useSession();

  const [ lastPage, setLastPage ] = useState<number>(1)

  useEffect(() => {
    async function fetchData() {
      if (session?.user.merchant_id) {
        const resp = await getStockAdjustments({merchant_id: session?.user.merchant_id, filter});
        setData(resp.data);
        setLastPage(resp.meta.last_page)
      }
    }
    fetchData();
  }, [session?.user]);

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-8"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Date</TableHead>
              <TableHead className="">Transaction No</TableHead>
              <TableHead className="text-center">Category</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.map((e: StockAdjustment) => {
                return (
                  <TableRow key={e.sa_id}>
                    <TableCell className="">
                      {e.transaction_date?.toString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/inventory/stock-adjustment/${e.sa_id}`}
                        className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                      >
                        {e.transaction_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {e.sa_category_label}
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
            filter.page >= 1 &&
            onChangePagination(filter.page - 1)
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
            filter.page != lastPage &&
            onChangePagination(filter.page + 1)
          }
          style={{
            display:
              filter.page === lastPage ? "none" : "flex",
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StockAdjustmentList;
