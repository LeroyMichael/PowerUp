"use client";
import { SearchInput } from "@/components/atoms/search-input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProducts } from "@/lib/inventory/products/utils";
import { Product, ProductRequest, ProductsRequest } from "@/types/product";
import { Sale, SaleDefaultValues, SaleSchema } from "@/types/sale.d";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

const SaleMobilePage = () => {
  const { data: session, status } = useSession();

  const { control, register } = useForm<ProductsRequest>();
  const { fields, append, prepend, update } = useFieldArray({
    control,
    name: "product_list",
  });

  const methods = useForm<Sale>({
    resolver: zodResolver(SaleSchema),
    defaultValues: SaleDefaultValues,
    reValidateMode: "onChange",
  });

  useEffect(() => {
    async function fetchProducts() {
      (await getProducts(session?.user.merchant_id)).forEach((product) =>
        append({
          product_id: product.product_id,
          product_name: product.name,
          sell_price: product.sell.sell_price,
          selected_qty: 0,
        })
      );
    }
    fetchProducts();
  }, [session?.user.merchant_id]);

  const handleIncreaseQty = (index: number) => {
    const updatedQty = fields[index].selected_qty + 1;
    update(index, { ...fields[index], selected_qty: updatedQty });
  };

  const handleDecreaseQty = (index: number) => {
    const updatedQty =
      fields[index].selected_qty > 0 ? fields[index].selected_qty - 1 : 1;
    update(index, { ...fields[index], selected_qty: updatedQty });
  };
  return (
    <>
      <FormProvider {...methods}>
        <div className="min-h-[89vh] ">
          {/* Header */}
          <div className="grid gap-4">
            <Card>
              <CardHeader className="grid grid-cols-2 gap-4 items-center text-center">
                <div>
                  <CardTitle className="mt-2">Rp420.000</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Total Price
                  </div>
                </div>
                <div>
                  <CardTitle>+25 items</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Total Items
                  </div>
                </div>
              </CardHeader>
            </Card>
            {/* Content */}
            <div>
              <Card>
                <CardHeader className="px-4 pt-5">
                  <CardTitle>Select Items</CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <ScrollArea className=" h-[49vh] w-full rounded-md ">
                    <div className="grid grid-cols-2 gap-2">
                      {fields.map((product: ProductRequest, index) => (
                        <Card className="" key={product.product_id}>
                          <CardHeader className="p-3">
                            <CardTitle className="text-sm">
                              {product.product_name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              <NumericFormat
                                value={product.sell_price}
                                displayType={"text"}
                                prefix={"Rp"}
                                allowNegative={false}
                                decimalSeparator={","}
                                thousandSeparator={"."}
                                fixedDecimalScale={true}
                              />
                            </CardDescription>
                          </CardHeader>
                          <CardFooter className="p-3 w-full">
                            {product.selected_qty == 0 ? (
                              <Button
                                className="h-7 w-full"
                                onClick={() => {
                                  handleIncreaseQty(index);
                                }}
                              >
                                Add Item
                              </Button>
                            ) : (
                              <div className="w-full grid grid-cols-3 justify-center justify-self-center">
                                <Button
                                  className="h-7 col-span-1"
                                  onClick={() => {
                                    handleDecreaseQty(index);
                                  }}
                                >
                                  -
                                </Button>
                                <div className="col-span-1 text-center">
                                  {product.selected_qty}
                                </div>
                                <Button
                                  className="h-7"
                                  onClick={() => {
                                    handleIncreaseQty(index);
                                  }}
                                >
                                  +
                                </Button>
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Footer */}
          <div className="px-4 w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-12 gap-4">
            <SearchInput className="col-span-10" placeholder="Search item" />
            <Button className="col-span-2">
              <ArrowRight color="#ffffff" />
            </Button>
          </div>
        </div>
      </FormProvider>
    </>
  );
};

export default SaleMobilePage;
