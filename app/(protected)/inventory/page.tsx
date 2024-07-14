"use client";

import ProductList from "@/components/inventory/products/product-list";
import StockAdjustmentList from "@/components/inventory/stock-adjustment/stock-adjustment-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { debounce } from "lodash";
import { PackagePlus, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState<string>("products");

  const defaultFilter = {
    search: "",
    page: 1,
    perPage: 10,
  };

  const [filter, setFilter] = useState(defaultFilter);

  const handleSearch = (searchValue: string) => {
    debounceSearchExpenses(searchValue);
  };

  const handlePagination = (page: number) => {
    setFilter({ ...filter, page });
  };

  const debounceSearchExpenses = useMemo(
    () =>
      debounce((value: string) => {
        setFilter({ ...filter, search: value, page: 1 });
      }, 1000),
    []
  );

  useEffect(() => {
    setFilter(defaultFilter);
  }, [activeTab]);

  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex w-100 justify-between items-center">
          <div className="flex flex-col space-y-1.5">
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              List of products and stock adjustment
            </CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button size="sm" className="h-8 gap-1">
              <Link
                href="/inventory/products/new"
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Create Product
                </span>
              </Link>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <Link
                href="/inventory/stock-adjustment/new"
                className="flex items-center gap-2"
              >
                <PackagePlus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Create Stock Adjustment
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col space-y-8 lg:flex-row ">
        <div className="flex-1 ">
          <Tabs
            defaultValue="products"
            className="grid gap-2"
            onValueChange={(value) => {
              setFilter(defaultFilter);
              setActiveTab(value);
            }}
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="stock">Stock Adjustment</TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="overflow-hidden">
              <ProductList
                onSearch={handleSearch}
                onChangePagination={handlePagination}
                filter={filter}
              />
            </TabsContent>
            <TabsContent value="stock" className="overflow-hidden">
              <StockAdjustmentList
                onSearch={handleSearch}
                onChangePagination={handlePagination}
                filter={filter}
              />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryPage;
