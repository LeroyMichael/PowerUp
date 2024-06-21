"use client";
import * as z from "zod";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import {
  Badge,
  CalendarIcon,
  ChevronLeft,
  Loader2,
  PlusCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { ComboboxProduct } from "@/components/ui/combo-box-product";

import AutoFill from "@/components/molecules/auto-fill";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { Sale, SaleDefaultValues, SaleSchema, SalesType } from "@/types/sale.d";
import { createSale, getSale, updateSale } from "@/lib/sales/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { updateLocale } from "moment";
import { cn, convertToRoman, numbering } from "@/lib/utils";

import { getProducts } from "@/lib/inventory/products/utils";
import { Product } from "@/types/product";
import { Contact } from "@/types/contact";
import { getContacts } from "@/lib/contacts/utils";
import ContactDetailComponent from "./contactDetail";
import SalesInformationComponent from "./salesInformation";
// async function getData(sale_id: string, merchant_id: string) {
//   return getSale();
// }

const SalePage = ({ params }: { params: { sale: string } }) => {
  console.log("RE RENDERED PARENT");
  const { data: session, status } = useSession();

  const router = useRouter();

  const [currentSubtotal, setCurrentSubtotal] = useState(0);

  const formsales = useForm<Sale>({
    resolver: zodResolver(SaleSchema),
    defaultValues: SaleDefaultValues,
    mode: "onChange",
  });

  console.log("PARAAMMSSSS = ", params);

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control: formsales.control,
  });

  async function submitCopy(data: Sale) {
    data.transaction_number = numbering("Sales");
    formsales.setValue("transaction_number", numbering("Sales"));
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 2),
    });
  }

  async function onSubmit(data: Sale, isPaid: boolean = false) {
    data.merchant_id = session?.user.merchant_id;

    calculate();
    data.subtotal = formsales.getValues("subtotal");
    data.total = formsales.getValues("total");
    console.log("Submit", JSON.stringify(data, null, 2));

    console.log("DATA SUBMITTED : ", data);
    if (params.sale == "new") {
      createSale(data, session?.user.merchant_id, router, isPaid);
    } else {
      updateSale(data, session?.user.merchant_id, Number(params.sale));
    }
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  async function onSubmitPaid(data: Sale) {
    await onSubmit(data, true);
  }

  async function onSubmitUnpaid(data: Sale) {
    await onSubmit(data, false);
  }

  function calculate() {
    console.log("calculate");

    formsales.setValue("discount_price_cut", 0);
    const discount_price_cut = formsales.getValues("discount_price_cut");
    const discount_type = formsales.setValue("discount_type", null);
    const tax_rate_set = formsales.setValue("tax_rate", "0");
    const tax_rate = formsales.getValues("tax_rate");

    const delivery = formsales.getValues("delivery") ?? 0;
    const tax = formsales.getValues("tax") ?? 0;
    const discount = formsales.getValues("discount_value") ?? 0;
    const subtotal =
      formsales
        .getValues("details")
        ?.reduce((a, c) => Number(c.unit_price) * Number(c.qty) + a, 0) ?? 0;

    const withDelivery = subtotal + delivery;
    const totalAfterDiscount = withDelivery - discount_price_cut;
    const totalTax = (totalAfterDiscount * parseFloat(tax_rate)) / 100;
    const total = totalAfterDiscount + totalTax;

    console.log("SUBTOTAL ITEM + ", formsales.getValues("details"));
    console.log("SUBTOTAL ITEM + ", subtotal);
    setCurrentSubtotal(subtotal);
    formsales.setValue("subtotal", subtotal);
    formsales.setValue("total", total);
    setSaveContact(!saveContact);
  }

  function autoFill(raw: string) {
    raw.split("\n").forEach(function (value) {
      const [key, val] = value.split(":");
      switch (key) {
        default: {
          break;
        }
      }
    });
  }

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    async function get() {
      params?.sale != "new" && formsales.reset(await getSale(params?.sale));
    }
    get();
  }, [params?.sale, session?.user]);

  let [item, setItem] = useState<string>("");

  const [contactType, setContactType] = useState("new");
  const [saveContact, setSaveContact] = useState(false);
  const [products, setProducts] = useState<Array<Product>>([]);

  useEffect(() => {
    async function fetchProducts() {
      if (session?.user.merchant_id) {
        const resp = await getProducts(session?.user.merchant_id);
        setProducts(resp);
      }
    }
    fetchProducts();
  }, [params?.sale, session?.user]);

  const {
    handleSubmit,
    formState: { errors },
  } = formsales;
  console.log("ASDASDASDASDASDSA = ", errors);
  return (
    <>
      <Form {...formsales}>
        <form className="">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-4">
              <Button
                type="reset"
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {params?.sale == "new"
                  ? "New Sale"
                  : formsales.getValues("transaction_number")}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <div className="flex flex-col md:flex-row gap-5">
                <Button onClick={handleSubmit(onSubmitUnpaid)}>
                  {params?.sale == "new" ? "+ CREATE" : "Save"}
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <Button onClick={handleSubmit(onSubmitPaid)}>
                  {params?.sale == "new" ? "+ CREATE AND PAY" : "Save"}
                </Button>
              </div>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <div className="flex flex-col md:flex-row gap-5">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => calculate()}
                  >
                    Refresh
                  </Button>
                  {params?.sale && (
                    <Button
                      type="button"
                      variant="default"
                      onClick={() => submitCopy(formsales.getValues())}
                    >
                      Make a Copy
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            {/* SALES INFROMATION AND CONTACT DETAIL PART */}
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <SalesInformationComponent formsales={formsales} />
              <ContactDetailComponent formsales={formsales} />
            </div>
            <div className="md:grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Sales Type
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Type of sales
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row">
                  <FormField
                    control={formsales.control}
                    name="transaction_type"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue="Penawaran"
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pro Invoice">
                                Pro Invoice
                              </SelectItem>
                              <SelectItem value="Invoice">Invoice</SelectItem>
                              <SelectItem value="Penawaran">
                                Penawaran
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Wallet
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Select Wallet
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row">
                  <FormField
                    control={formsales.control}
                    name="wallet_id"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={"1"}
                            value={field.value?.toString()}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pro Invoice">
                                Pro Invoice
                              </SelectItem>
                              <SelectItem value="Invoice">Invoice</SelectItem>
                              <SelectItem value="Penawaran">
                                Penawaran
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ROW 2*/}
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 pt-4 md:pt-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card className="overflow-hidden">
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Items
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="overflow-hidden">
                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {/* <TableHead className="w-[150px]">Nama Barang</TableHead> */}
                          <TableHead>Jenis dan Ukuran</TableHead>
                          <TableHead className="">Quantity</TableHead>
                          <TableHead className="text-right w-28">
                            Harga Satuan
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <FormField
                                control={formsales.control}
                                name={`details.${index}.product_id`}
                                render={({ field }) => (
                                  <FormItem className="">
                                    <FormControl>
                                      {params?.sale != "new" ? (
                                        <p>{field.value}</p>
                                      ) : (
                                        <ComboboxProduct
                                          items={products}
                                          onValueChange={field.onChange}
                                          value={field.value}
                                        />
                                      )}
                                    </FormControl>
                                    <FormMessage className="absolute" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={formsales.control}
                                name={`details.${index}.qty`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        inputMode="numeric"
                                        placeholder="Quantity"
                                        className="resize-none"
                                        {...field}
                                        onChange={(event) => {
                                          field.onChange(
                                            isNaN(Number(event.target.value))
                                              ? ""
                                              : +event.target.value
                                          );
                                          calculate();
                                        }}
                                      />
                                    </FormControl>
                                    <FormMessage className="absolute" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <FormField
                                control={formsales.control}
                                name={`details.${index}.unit_price`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input
                                        inputMode="numeric"
                                        placeholder="Price"
                                        className="resize-none w-28"
                                        {...field}
                                        onChange={(event) =>
                                          field.onChange(
                                            isNaN(Number(event.target.value))
                                              ? 0
                                              : +event.target.value
                                          )
                                        }
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      <NumericFormat
                                        value={field.value}
                                        displayType={"text"}
                                        prefix={"Rp"}
                                        allowNegative={false}
                                        decimalSeparator={","}
                                        thousandSeparator={"."}
                                        fixedDecimalScale={true}
                                      />
                                    </FormDescription>
                                    <FormMessage className="absolute" />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="icon">
                                <X
                                  className="h-4 w-4"
                                  type="button"
                                  onClick={() => remove(index)}
                                />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="justify-center border-t p-4">
                  <h3>Subtotal : {currentSubtotal}</h3>
                </CardFooter>
                <CardFooter className="justify-center border-t p-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={() =>
                      append({
                        product_id: 0,
                        description: "",
                        qty: 1,
                        unit_price: 0,
                      })
                    }
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add New Item
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Additional Price
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="mt-4 gap-4 flex flex-col">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={formsales.control}
                      name="discount_value"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Discount</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="100000"
                              {...field}
                              onChange={(event) =>
                                field.onChange(
                                  isNaN(Number(event.target.value))
                                    ? ""
                                    : +event.target.value
                                )
                              }
                              inputMode="numeric"
                            />
                          </FormControl>
                          <FormDescription>
                            <NumericFormat
                              className="absolute"
                              value={field.value}
                              displayType={"text"}
                              prefix={"Rp"}
                              allowNegative={false}
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              fixedDecimalScale={true}
                            />
                          </FormDescription>
                          <FormMessage className="absolute" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formsales.control}
                      name="delivery"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>Delivery</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="100000"
                              {...field}
                              onChange={(event) =>
                                field.onChange(
                                  isNaN(Number(event.target.value))
                                    ? ""
                                    : +event.target.value
                                )
                              }
                              inputMode="numeric"
                            />
                          </FormControl>
                          <FormDescription>
                            <NumericFormat
                              className="absolute"
                              value={field.value}
                              displayType={"text"}
                              prefix={"Rp"}
                              allowNegative={false}
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              fixedDecimalScale={true}
                            />
                          </FormDescription>
                          <FormMessage className="absolute" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={formsales.control}
                      name="tax"
                      render={({ field }) => (
                        <FormItem className="">
                          <FormLabel>Tax %</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10%"
                              {...field}
                              onChange={(event) =>
                                field.onChange(
                                  isNaN(Number(event.target.value))
                                    ? ""
                                    : +event.target.value
                                )
                              }
                              inputMode="numeric"
                            />
                          </FormControl>
                          <FormDescription>
                            <NumericFormat
                              className="absolute"
                              value={field.value}
                              displayType={"text"}
                              allowNegative={false}
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              fixedDecimalScale={true}
                              suffix={"%"}
                            />
                          </FormDescription>
                          <FormMessage className="absolute" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={formsales.control}
                      name="down_payment_amount"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>DP Rate %</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="50%"
                              {...field}
                              onChange={(event) =>
                                field.onChange(
                                  isNaN(Number(event.target.value))
                                    ? ""
                                    : +event.target.value
                                )
                              }
                              inputMode="numeric"
                            />
                          </FormControl>
                          <FormDescription>
                            <NumericFormat
                              className="absolute"
                              value={field.value}
                              displayType={"text"}
                              allowNegative={false}
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              fixedDecimalScale={true}
                              suffix={"%"}
                            />
                          </FormDescription>
                          <FormMessage className="absolute" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={formsales.control}
                    name="estimated_time"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Waktu Pengerjaan</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="1 sampai 2 minggu"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="absolute" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formsales.control}
                    name="is_presigned"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Do you want to sign the transaction?
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-5 p-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => calculate()}
            >
              Refresh
            </Button>

            <Button type="submit" variant="default">
              Save
            </Button>
            {params?.sale && (
              <Button
                type="button"
                variant="default"
                onClick={() => submitCopy(formsales.getValues())}
              >
                Make a Copy
              </Button>
            )}
          </div>
          <Button type="submit" variant="default">
            Save
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SalePage;
