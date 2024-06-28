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
import { getProducts, updateProduct } from "@/lib/inventory/products/utils";
import { Product, ProductRequest, ProductsRequest } from "@/types/product";
import { Sale, SaleDefaultValues, SaleSchema } from "@/types/sale.d";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
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
import SaleMobilePageShopListComponent from "./components/shoplist";
import SaleMobilePagePaymentComponent from "./components/payment";

interface ShoppingList {
  id: number;
  name: string;
  qty: number;
  price: number;
}

const SaleMobilePage = () => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Array<Product>>([]);
  const [tempProducts, setTempProducts] = useState<Array<Product>>([]);

  //buat table list item yang dipilih
  const [productList, setProductList] = useState<ShoppingList[]>([]);

  const { control, register } = useForm<ProductsRequest>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItemQty, setTotalItemQty] = useState(0);

  const [isListVisible, setIsListVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState(1);
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
      const res = await getProducts(session?.user.merchant_id);
      setProducts(res);
      setTempProducts(res);
      res.forEach((product) =>
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

  //buat update table list item yang dipilih
  const updateShoppingList = (product: any, isAdd: boolean) => {
    console.log("CALLED");
    const item: ShoppingList = {
      id: product.product_id,
      name: product.product_name,
      qty: 1,
      price: product.sell_price,
    };

    //cek id item yang dipilih ada ga di list
    // return boolean
    const isProductExist = productList.some(
      (pl) => pl.id == product.product_id
    );

    //kalo belom ada, add object baru
    if (!isProductExist) {
      setProductList([...productList, item]);
    } else {
      // kalo dah ada, update qty nya
      const updatedProductList = 
        productList.map((pl) => pl.id === product.product_id
          ? { ...pl, qty: isAdd ? pl.qty + 1 : pl.qty - 1 }
          : pl
      );
      //terus filter (buang kalo qty nya 0), remove dari shopping list
      setProductList(updatedProductList.filter((pl) => pl.qty !== 0));
    }
  };

  useEffect(() => {
    console.log("DASDASDASDA = ", productList);
  }, [productList]);

  const calculate = (product: any, isAdd: boolean) => {
    // buat set tampilan yang diatas
    if (isAdd) {
      setTotalPrice(totalPrice + parseFloat(product.sell_price));
      setTotalItemQty(totalItemQty + 1);
    } else {
      setTotalPrice(totalPrice - parseFloat(product.sell_price));
      setTotalItemQty(totalItemQty - 1);
    }
  };

  const handleIncreaseQty = (index: number, product: Product) => {
    const updatedQty = fields[index].selected_qty + 1;
    update(index, { ...fields[index], selected_qty: updatedQty });
    
    calculate(product, true);
    updateShoppingList(product, true);
  };

  const handleDecreaseQty = (index: number, product: Product) => {
    const updatedQty =
      fields[index].selected_qty > 0 ? fields[index].selected_qty - 1 : 1;
    update(index, { ...fields[index], selected_qty: updatedQty });
    
    calculate(product, false);
    updateShoppingList(product, false);
  };
  return (
    <>
      <FormProvider {...methods}>
        <div className="min-h-[89vh] " style={{ display: activeComponent == 1 ? "block" : "none" }}>
          {/* Header */}
          <div className="grid gap-4">
            <Card>
              <CardHeader className="grid grid-cols-2 gap-4 items-center text-center">
                <div>
                  <CardTitle className="mt-2">
                    Rp {numberToPriceFormat(totalPrice)}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    Total Price
                  </div>
                </div>
                <div>
                  <CardTitle>{totalItemQty} items</CardTitle>
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
                                  handleIncreaseQty(index, product);
                                }}
                              >
                                Add Item
                              </Button>
                            ) : (
                              <div className="w-full grid grid-cols-3 justify-center justify-self-center">
                                <Button
                                  className="h-7 col-span-1"
                                  onClick={() => {
                                    handleDecreaseQty(index, product);
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
                                    handleIncreaseQty(index, product);
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
            <Button
              onClick={() => setActiveComponent(2)}
              className="col-span-2"
            >
              <ArrowRight color="#ffffff" />
            </Button>
          </div>
        </div>
        <SaleMobilePageShopListComponent 
          productList={productList}
          totalPrice={totalPrice}
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
        <SaleMobilePagePaymentComponent 
          productList={productList}
          totalPrice={totalPrice}
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        />
      </FormProvider>
    </>
  );
};

export default SaleMobilePage;
