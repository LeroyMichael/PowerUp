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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getProducts, updateProduct } from "@/lib/inventory/products/utils";
import { createSale } from "@/lib/sales/utils";
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
import { useRouter } from "next/navigation";

interface ShoppingList {
  id: number;
  name: string;
  qty: number;
  price: number;
}

const SaleMobilePage = () => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Array<Product>>([]);
  const [temp, setTemp] = useState<Array<Product>>([]);
  const [tempProducts, setTempProducts] = useState<Array<Product>>([]);

  //buat table list item yang dipilih
  const [productList, setProductList] = useState<ShoppingList[]>([]);

  const { control, register } = useForm<ProductsRequest>();
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItemQty, setTotalItemQty] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);

  const [isListVisible, setIsListVisible] = useState(false);
  const [activeComponent, setActiveComponent] = useState(1);
  const { fields, append, prepend, update, remove } = useFieldArray({
    control,
    name: "product_list",
  });
  const router = useRouter();

  const methods = useForm<Sale>({
    resolver: zodResolver(SaleSchema),
    defaultValues: SaleDefaultValues,
    reValidateMode: "onChange",
  });

  useEffect(() => {
    async function fetchProducts() {
      const res = (await getProducts(session?.user.merchant_id)).filter(
        (e: Product) => e.sell.is_sell
      );
      setProducts(res);
      setTempProducts(res);
      remove();
      res.forEach((product) => {
        append({
          product_id: product.product_id,
          product_name: product.name,
          sell_price: product.sell.sell_price,
          selected_qty: 0,
        });
      });
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
      const updatedProductList = productList.map((pl) =>
        pl.id === product.product_id
          ? { ...pl, qty: isAdd ? pl.qty + 1 : pl.qty - 1 }
          : pl
      );
      //terus filter (buang kalo qty nya 0), remove dari shopping list
      setProductList(updatedProductList.filter((pl) => pl.qty !== 0));

      const sentDetails = productList.map((p, index) => {
        methods.setValue(`details.${index}.product_id`, p.id);
        methods.setValue(`details.${index}.description`, "");
        methods.setValue(`details.${index}.currency_code`, "IDR");
        methods.setValue(`details.${index}.unit_price`, p.price);
        methods.setValue(`details.${index}.qty`, p.qty);
        methods.setValue(`details.${index}.amount`, 123);
        // product_id: p.id,
        // description: "",
        // currency_code: "IDR",
        // unit_price: p.price.toString(),
        // qty: p.qty,
        // amount: "0"
      });
    }
  };

  useEffect(() => {
    console.log("DASDASDASDA = ", productList);
  }, [productList]);
  console.log("CUREEENTTT DATA ==== ", methods.getValues());

  useEffect(() => {
    methods.setValue("merchant_id", 1);
    methods.setValue("transaction_number", "1123/SALES/2024");
    const currentDate = new Date();
    methods.setValue("transaction_date", new Date());
    const dueDate = currentDate.setDate(currentDate.getDate() + 7);
    methods.setValue("due_date", new Date(dueDate));
    methods.setValue("contact_id", 1);
  }, []);

  const calculate = (product: any, isAdd: boolean) => {
    // buat set tampilan yang diatas
    if (isAdd) {
      setTotalPrice(totalPrice + parseFloat(product.sell_price));
      setTotalItemQty(totalItemQty + 1);
      setFinalPrice(totalPrice + parseFloat(product.sell_price));
    } else {
      setTotalPrice(totalPrice - parseFloat(product.sell_price));
      setTotalItemQty(totalItemQty - 1);
      setFinalPrice(totalPrice - parseFloat(product.sell_price));
    }
  };

  const calculateTotal = () => {
    const priceAfterDiscount = totalPrice - methods.getValues("discount_value");
    const priceAfterTax =
      priceAfterDiscount +
      (methods.getValues("tax_rate") * priceAfterDiscount) / 100;
    setFinalPrice(priceAfterTax);
    methods.setValue("total", finalPrice);
  };

  const handleIncreaseQty = (index: number, product: Product) => {
    const updatedQty = fields[index].selected_qty + 1;
    update(index, { ...fields[index], selected_qty: updatedQty });

    calculate(product, true);
    updateShoppingList(product, true);
  };

  // Buat submit ===============
  async function onSubmit(data: Sale, isPaid: boolean = false) {
    // data.merchant_id = 1;
    methods.setValue("merchant_id", 1);
    methods.setValue("subtotal", totalPrice);
    methods.setValue("tax_rate", 0);
    // data.subtotal = methods.getValues("subtotal");
    // data.total = methods.getValues("total");
    console.log("Submit", JSON.stringify(data, null, 2));

    // if (params.sale == "new") {
    createSale(data, session?.user.merchant_id, router, isPaid);
    console.log("DATA SUBMITTED : ", methods.getValues());
    // } else {
    //   updateSale(data, session?.user.merchant_id, Number(params.sale));
    // }
  }

  async function onSubmitUnpaid(data: Sale) {
    await onSubmit(data, false);
  }

  async function onSubmitPaid(data: Sale) {
    await onSubmit(data, false);
  }

  const handleDecreaseQty = (index: number, product: Product) => {
    const updatedQty =
      fields[index].selected_qty > 0 ? fields[index].selected_qty - 1 : 1;
    update(index, { ...fields[index], selected_qty: updatedQty });

    calculate(product, false);
    updateShoppingList(product, false);
  };

  const searchProduct = (term: string) => {
    setProducts(
      tempProducts.filter((e) => JSON.stringify(e).toLowerCase().includes(term))
    );
  };

  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  console.log("ERRRORRRR = ", errors);
  return (
    <>
      <Form {...methods}>
        <div
          className="min-h-[89vh] "
          style={{ display: activeComponent == 1 ? "block" : "none" }}
        >
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
            <SearchInput
              className="col-span-10"
              placeholder="Search item"
              onChange={(e) => searchProduct(e.target.value)}
            />
            <Button
              onClick={() => setActiveComponent(2)}
              className="col-span-2"
            >
              <ArrowRight color="#ffffff" />
            </Button>
          </div>
        </div>
        <form>
          <SaleMobilePageShopListComponent
            productList={productList}
            totalPrice={totalPrice}
            activeComponent={activeComponent}
            form={methods}
            setActiveComponent={setActiveComponent}
            calculateTotal={calculateTotal}
            finalPrice={finalPrice}
            setFinalPrice={setFinalPrice}
          />
          <SaleMobilePagePaymentComponent
            productList={productList}
            totalPrice={totalPrice}
            activeComponent={activeComponent}
            setActiveComponent={setActiveComponent}
            form={methods}
            handleSubmit={handleSubmit}
            onSubmitPaid={onSubmitPaid}
            onSubmitUnpaid={onSubmitUnpaid}
          />
        </form>
        {/* <form onSubmit={methods.handleSubmit(onSubmitUnpaid)}>
          <Button onClick={methods.handleSubmit(onSubmitUnpaid)}>
            SUBMIT
          </Button>
        </form> */}
      </Form>
    </>
  );
};

export default SaleMobilePage;
