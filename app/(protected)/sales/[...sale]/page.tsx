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

// async function getData(sale_id: string, merchant_id: string) {
//   return getSale();
// }

const SalePage = ({ params }: { params: { sale: string } }) => {
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

  console.log("FIELLDSSSSSS = ", fields);
  console.log("FIELLDSSSSSS aaaa = ", formsales.getValues());

  async function submitCopy(data: Sale) {
    console.log("Submit Copy", data);
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
  // const onSubmit = () => {
  //   console.log("ASDASDD");
  // }
  console.log("PARAAMMSSSS 2 = ", params);

  console.log("DATAAAAAA: OTTTT ", formsales);
  async function onSubmit(data: Sale) {
    console.log("onSubmit FUNCTION = ", params);
    console.log("DATAAAAAA: ", data);
    // params?.sale != "new"
    //   ? await updateSale(data, session?.user.merchant_id, params?.sale)
    //   : await createSale(data, session?.user.merchant_id);
    //   try {
    //     console.log("onSubmit function called");
    //     // Rest of your onSubmit function...
    // } catch (error) {
    //     console.error("Error in onSubmit:", error);
    // }
    data.merchant_id = session?.user.merchant_id;
    console.log("save customer: ", saveCustomer);
    if (saveCustomer) {
      data.contact_id = 0;
    } else {
      data.contact_id = 1;
    }

    calculate();
    data.subtotal = formsales.getValues("subtotal");
    data.total = formsales.getValues("total");
    console.log("Submit", JSON.stringify(data, null, 2));
    if (params.sale) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/sales/${params.sale}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data, null, 2),
        }
      );
    } else {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data, null, 2),
      });
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

  console.log("PARAAMMSSSS 3 = ", params);

  function calculate() {
    console.log("calculate");
    setSaveCustomer(!saveCustomer);

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
    setSaveCustomer(!saveCustomer);
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
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/contacts?merchantId=${session?.user.merchant_id}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCustomers(data);
        localStorage.setItem("customers", JSON.stringify(data));
      })
      .catch((error) => console.log("error", error));
  }, [session?.user]);

  const [customers, setCustomers] = useState<Array<Contact>>();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [selectedCustomerID, setSelectedCustomerID] = useState(-1);
  const [customerType, setCustomerType] = useState("new");
  const [saveCustomer, setSaveCustomer] = useState(false);
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

  function selectCustomer(data: any) {
    const details = JSON.parse(data.details);
    console.log(details);
    setSelectedCustomer(data.customer_id);
    formsales.setValue("contact_id", data.customer_id);
    console.log(
      "SELCTEDDDD CONTACCTTTTT = ",
      formsales.getValues("contact_id")
    );
    console.log("SELCTEDDDD CONTACCTTTTT DATA = ", data);
  }

  const {
    handleSubmit,
    formState: { errors },
  } = formsales;
  console.log("ASDASDASDASDASDSA = ", errors);
  return (
    <>
      <Form {...formsales}>
        <form onSubmit={handleSubmit(onSubmit)} className="">
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
                <Button type="submit">
                  {params?.sale == "new" ? "+ CREATE" : "Save"}
                </Button>
              </div>
              <div className="flex flex-col md:flex-row gap-5">
                <Button>
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
                  {/* {isClient ? (
                    <div>
                      <PDFDownloadLink
                        document={
                          <SalesInvoiceGenerator data={formsales.getValues()} />
                        }
                        fileName={
                          formsales.getValues("invoiceNumber").replace(".", "_") +
                          "-" +
                          formsales.getValues("type") +
                          "-" +
                          formsales.getValues("company")
                        }
                        className="w-full"
                      >
                        {({ loading }) =>
                          loading ? (
                            <Button
                              variant="outline"
                              disabled
                              className="w-full"
                            >
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading..
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full"
                            >
                              Download
                            </Button>
                          )
                        }
                      </PDFDownloadLink>
                    </div>
                  ) : null} */}
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
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sale Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-8 lg:flex-row">
                  <div className="flex-1 my-5">
                    <div className="space-y-8 ">
                      <FormField
                        control={formsales.control}
                        name="transaction_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Transaction No</FormLabel>
                            <FormControl>
                              <Input placeholder="10 Oktober 2023" {...field} />
                            </FormControl>
                            <FormMessage className="" />
                          </FormItem>
                        )}
                      />
                      <div className="flex gap-5">
                        <FormField
                          control={formsales.control}
                          name="transaction_date"
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel>Transaction Date</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="12 Oktober 2023"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={formsales.control}
                          name="due_date"
                          render={({ field }) => (
                            <FormItem className="w-full flex flex-col">
                              <FormLabel>Invoice Due Date</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="10 Oktober 2023"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="absolute" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <FormField
                      control={formsales.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memo</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Sale for Tokopedia"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Customer Details
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Add customer details.
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col lg:flex-row">
                  {/* <Search /> */}
                  <ScrollArea className="h-[300px] w-full">
                    <div className="grid md:grid-cols-2 gap-5 ">
                      {customers?.map((item: Contact) => {
                        return (
                          <button
                            type="button"
                            key={item.contact_id}
                            className={cn(
                              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                              selectedCustomerID === item.contact_id &&
                                "bg-muted"
                            )}
                            onClick={() => {
                              selectCustomer(item),
                                setSelectedCustomerID(Number(item.contact_id));
                            }}
                          >
                            <div className="flex w-full flex-col gap-1">
                              <div className="flex items-center">
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold">
                                    {item.company_name} / {item.display_name}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs font-medium">
                                {item.phone_number}
                              </div>
                              <div className="text-xs font-medium">
                                {item.email}
                              </div>
                            </div>
                            <div className="line-clamp-2 text-xs text-muted-foreground">
                              {item.billing_address}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
            <div className="hidden md:grid auto-rows-max items-start gap-4 lg:gap-8">
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
              <AutoFill autoFill={autoFill} />
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
            {/* {isClient ? (
              <div>
                <PDFDownloadLink
                  document={<InvoiceGenerator data={formsales.getValues()} />}
                  fileName={
                    formsales.getValues("invoiceNumber").replace(".", "_") +
                    "-" +
                    formsales.getValues("type") +
                    "-" +
                    formsales.getValues("company")
                  }
                  className="w-full"
                >
                  {({ loading }) =>
                    loading ? (
                      <Button variant="outline" disabled className="w-full">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading..
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                      >
                        Download
                      </Button>
                    )
                  }
                </PDFDownloadLink>
              </div>
            ) : null} */}
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
