"use client";
import { SearchInput } from "@/components/atoms/search-input";
import { Button } from "@/components/ui/button";
import { Product, ProductRequest, ProductsRequest } from "@/types/product";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { numberFixedToString, numberToPriceFormat } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ShoppingList {
  id: number;
  name: string;
  qty: number;
  price: number;
}

interface Props {
  productList: any;
  totalPrice: number;
  activeComponent: number;
  setActiveComponent: (arg0: number) => void;
}

const SaleMobilePageShopListComponent = ({
  activeComponent,
  setActiveComponent,
  productList,
  totalPrice,
}: Props) => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Array<Product>>([]);
  const [tempProducts, setTempProducts] = useState<Array<Product>>([]);

  //buat table list item yang dipilih

  const [totalItemQty, setTotalItemQty] = useState(0);

  //   const calculate = (product: any, isAdd: boolean) => {
  //     // buat set tampilan yang diatas
  //     if (isAdd) {
  //       setTotalPrice(totalPrice + parseFloat(product.sell_price));
  //       setTotalItemQty(totalItemQty + 1);
  //     } else {
  //       setTotalPrice(totalPrice - parseFloat(product.sell_price));
  //       setTotalItemQty(totalItemQty - 1);
  //     }
  //   };

  return (
    <>
      <div
        className="min-h-[89vh] "
        style={{ display: activeComponent == 2 ? "block" : "none" }}
      >
        {/* Header */}
        <div className="grid gap-4">
          <div
            className="rounded-md border mb-3"
            style={{ display: activeComponent == 2 ? "block" : "none" }}
          >
            <Table>
              <TableBody>
                {productList.length != 0 ? (
                  productList.map((pl: any) => {
                    return (
                      <TableRow key={pl.id}>
                        <TableCell className="capitalize">
                          {pl.name}
                          <br />
                          <small>
                            {" "}
                            {pl.qty} x{" "}
                            {numberToPriceFormat(parseInt(pl.price.toString()))}
                          </small>
                        </TableCell>
                        <TableCell className="capitalize">
                          {pl.qty * pl.price}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="w-100 h-24 text-center">
                      No item.
                    </TableCell>
                  </TableRow>
                )}
                <TableRow>
                  <TableCell className="w-100 h-24r">
                    <strong>SUBTOTAL</strong>
                  </TableCell>
                  <TableCell className="w-100 h-24r">
                    <strong>{numberToPriceFormat(totalPrice)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="rounded-md border mb-3">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Discount</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tax</TableCell>
                  <TableCell>0 %</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>TOTAL</strong>
                  </TableCell>
                  <TableCell>
                    <strong>{numberToPriceFormat(totalPrice)}</strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        {/* Footer */}
        <div className="px-4 w-full absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-12 gap-4">
          <Button onClick={() => setActiveComponent(1)} className="col-span-2">
            <ArrowLeft color="#ffffff" />
          </Button>
          <div className="col-span-8"></div>
          <Button onClick={() => setActiveComponent(3)} className="col-span-2">
            <ArrowRight color="#ffffff" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default SaleMobilePageShopListComponent;
