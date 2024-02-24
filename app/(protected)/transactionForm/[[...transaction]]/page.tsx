"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { cn, convertToRoman, numbering } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import InvoiceGenerator from "@/components/invoice/invoice-generator";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import AutoFill from "@/components/molecules/auto-fill";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "@/components/atoms/search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

const profileFormSchema = z.object({
  merchant_id: z.number(),
  customer_id: z.number().nullable(),
  invoiceNumber: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  name: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  company: z
    .string()
    .min(2, {
      message: "name must be at least 2 characters.",
    })
    .max(30, {
      message: "name must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email()
    .optional(),
  address: z.string().optional(),
  telephone: z.number().optional(),
  invoices: z
    .array(
      z.object({
        namaBarang: z.string(),
        desc: z.string(),
        quantity: z.number().min(1),
        price: z.number().min(1),
      })
    )
    .optional(),
  discount: z.number().min(0).optional(),
  delivery: z.number().min(0).optional(),
  type: z.enum(["Pro Invoice", "Invoice", "Penawaran"], {
    required_error: "You need to select a file type.",
  }),
  subtotal: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  dp: z.number().min(0).optional(),
  invoiceDate: z.string(),
  invoiceDueDate: z.string(),
  estimatedTime: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  merchant_id: 0,
  customer_id: null,
  name: "",
  company: "",
  email: "",
  address: "",
  telephone: 0,
  invoices: [
    {
      namaBarang: "WIREMESH Conveyor",
      desc: "Wiremesh Conveyor Unit dengan ukuran",
      quantity: 1,
      price: 2000,
    },
  ],
  delivery: 0,
  tax: 0,
  discount: 0,
  dp: 50,
  type: "Penawaran",
  invoiceDueDate: moment().format("D MMMM YYYY"),
  invoiceDate: moment().format("D MMMM YYYY"),
  invoiceNumber: numbering("Penawaran"),
  estimatedTime: "1 sampai 2 minggu",
};

async function getData(transactionId: string): Promise<any> {
  if (transactionId) {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/transactions/${transactionId}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => JSON.parse(data.details))
      .catch((e) => console.log(e));
    return data ? data : defaultValues;
  } else {
    console.log("defaultValue");
    return defaultValues;
  }
}

const TransactionForm = ({ params }: { params: { transaction: string } }) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: defaultValues,
    mode: "onChange",
  });

  const watch = form.watch(["tax", "dp", "delivery", "discount", "invoices"]);

  const { fields, append, remove } = useFieldArray({
    name: "invoices",
    control: form.control,
  });
  async function submitCopy(data: ProfileFormValues) {
    data.customer_id = null;
    console.log("Submit Copy", data);
    data.invoiceNumber = numbering(data.type, item);
    form.setValue("invoiceNumber", numbering(data.type, item));
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data, null, 2),
    });
  }
  async function onSubmit(data: ProfileFormValues) {
    data.merchant_id = session?.user.merchant_id;
    console.log("save customer: ", saveCustomer);
    if (saveCustomer) {
      data.customer_id = null;
    } else {
      data.customer_id = 1;
    }

    calculate();
    console.log("Submit", JSON.stringify(data, null, 2));
    if (params.transaction) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/transactions/${params.transaction}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data, null, 2),
        }
      );
    } else {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data, null, 2),
        }
      );
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

  function calculate() {
    console.log("calculate");
    setSaveCustomer(!saveCustomer);

    const delivery = form.getValues("delivery") ?? 0;
    const tax = form.getValues("tax") ?? 0;
    const discount = form.getValues("discount") ?? 0;
    const subtotal =
      form
        .getValues("invoices")
        ?.reduce((a, c) => c.price * c.quantity + a, 0) ?? 0;

    const withDelivery = subtotal + delivery;
    const totalAfterDiscount = withDelivery - discount;
    const totalTax = (totalAfterDiscount * tax) / 100;
    const total = totalAfterDiscount + totalTax;

    form.setValue("subtotal", subtotal);
    form.setValue("total", total);
    setSaveCustomer(!saveCustomer);
  }

  function autoFill(raw: string) {
    raw.split("\n").forEach(function (value) {
      const [key, val] = value.split(":");
      switch (key) {
        case "Nama": {
          form.setValue("name", val.trim());
          break;
        }
        case "Nama PT": {
          form.setValue("company", val.trim());
          break;
        }
        case "Alamat pengiriman": {
          form.setValue("address", val.trim());
          break;
        }
        case "Email": {
          form.setValue("email", val.trim());
          break;
        }
        case "No HP": {
          form.setValue("telephone", Number(val.trim()));
          break;
        }
        case "No Hape": {
          form.setValue("telephone", Number(val.trim()));
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  const [isClient, setIsClient] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => {
    async function get() {
      const temp = await getData(params?.transaction);
      form.reset(temp);
    }
    get();
  }, [params.transaction, form]);

  let [item, setItem] = useState<string>("");
  useEffect(() => {
    if (!params?.transaction)
      form.setValue("invoiceNumber", numbering(form.getValues("type"), item));
  }, [item]);
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/customers?merchantId=${session?.user.merchant_id}`,
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
  }, [session]);
  useEffect(() => {
    setIsClient(true);
    const cnt = localStorage.getItem("count");
    setItem(cnt ? cnt : "");
    // autoFill(
    //   "Nama: Tri Wahyuningsih\nNama PT: PT LIWAYWAY\nAlamat pengiriman: Jl.Jababrka XVII B Blok U5A kawasan industri jababeka 1 cikarang utara bekasi\nNo HP:081284435350\nEmail:purchasing3@oishi.co.id "
    // );
  }, []);

  const [customers, setCustomers] = useState<Array<any>>();
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [customerType, setCustomerType] = useState("new");
  const [saveCustomer, setSaveCustomer] = useState(false);

  function selectCustomer(data: any) {
    const details = JSON.parse(data.details);
    console.log(details);
    setSelectedCustomer(data.customer_id);
    form.setValue("customer_id", data.customer_id);
    form.setValue("name", details.customer_name);
    form.setValue("company", details.company_name);
    form.setValue("email", details.email);
    form.setValue("address", details.address);
    form.setValue("telephone", details.phone_number);
  }

  function radioOnChange(...event: any[]) {
    form.setValue("type", event[0]);
    form.setValue("invoiceNumber", numbering(form.getValues("type"), item));
  }

  return (
    <>
      <AutoFill autoFill={autoFill} />
      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 lg:max-w-2xl">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-10">
                  <FormLabel>Tipe Surat</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={radioOnChange}
                      defaultValue={field.value}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Pro Invoice" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Pro Invoice
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Invoice" />
                        </FormControl>
                        <FormLabel className="font-normal">Invoice</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Penawaran" />
                        </FormControl>
                        <FormLabel className="font-normal">Penawaran</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number#</FormLabel>
                  <FormControl>
                    <Input placeholder="07/CTS/W/VIII/2023" {...field} />
                  </FormControl>
                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />
            <div className="flex gap-5">
              <FormField
                control={form.control}
                name="invoiceDate"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel>Invoice Date</FormLabel>
                    <FormControl>
                      <Input placeholder="10 Oktober 2023" {...field} />
                    </FormControl>
                    <FormMessage className="absolute" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoiceDueDate"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col">
                    <FormLabel>Invoice Due Date</FormLabel>
                    <FormControl>
                      <Input placeholder="10 Oktober 2023" {...field} />
                    </FormControl>
                    <FormMessage className="absolute" />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-6" />
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold">Customer Details</h2>
              <p className="text-muted-foreground">
                Create new customer or select existing customer
              </p>
            </div>
            <Tabs
              defaultValue="new"
              value={customerType}
              onValueChange={setCustomerType}
              className="w-full !mt-5 "
            >
              <TabsList>
                <TabsTrigger value="new">New Customer</TabsTrigger>
                <TabsTrigger value="exist">Existing Customer</TabsTrigger>
              </TabsList>
              <TabsContent value="new" className="grid gap-5 pt-3">
                <div className="flex gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nama Penerima</FormLabel>
                        <FormControl>
                          <Input placeholder="Asep" {...field} />
                        </FormControl>
                        <FormMessage className="absolute" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Nama Company</FormLabel>
                        <FormControl>
                          <Input placeholder="PT. Asep" {...field} />
                        </FormControl>
                        <FormMessage className="absolute" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="asep@asep.com" {...field} />
                        </FormControl>
                        <FormMessage className="absolute" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>No Hp</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="08120000000"
                            inputMode="numeric"
                            {...field}
                            onChange={(event) =>
                              field.onChange(
                                isNaN(Number(event.target.value))
                                  ? ""
                                  : +event.target.value
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage className="absolute" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Alamat"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="absolute" />
                    </FormItem>
                  )}
                />
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveCustomer"
                    value={saveCustomer.toString()}
                    onCheckedChange={(e: boolean) => setSaveCustomer(e)}
                  />
                  <label
                    htmlFor="saveCustomer"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Save Customer Details into Existing Customer List
                  </label>
                </div>
              </TabsContent>
              <TabsContent value="exist">
                {/* <Search /> */}
                <ScrollArea className="h-[300px]">
                  <div className="grid md:grid-cols-2 gap-5 ">
                    {customers?.map((item) => {
                      const details = JSON.parse(item.details);
                      return (
                        <button
                          type="button"
                          key={item.customer_id}
                          className={cn(
                            "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                            selectedCustomer === item.customer_id && "bg-muted"
                          )}
                          onClick={() => selectCustomer(item)}
                        >
                          <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center">
                              <div className="flex items-center gap-2">
                                <div className="font-semibold">
                                  {details.company_name} /{" "}
                                  {details.customer_name}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs font-medium">
                              {details.phone_number}
                            </div>
                            <div className="text-xs font-medium">
                              {details.email}
                            </div>
                          </div>
                          <div className="line-clamp-2 text-xs text-muted-foreground">
                            {details.address}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          <Separator className="my-6" />
          <h1 className="text-xl font-bold">Items & Additional Price</h1>
          <div>
            <Table>
              <TableCaption>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() =>
                    append({ namaBarang: "", desc: "", quantity: 1, price: 0 })
                  }
                >
                  Add New Item
                </Button>
              </TableCaption>
              <TableHeader>
                <TableRow>
                  {/* <TableHead className="w-[150px]">Nama Barang</TableHead> */}
                  <TableHead>Jenis dan Ukuran</TableHead>
                  <TableHead className="w-[80px]">Quantity</TableHead>
                  <TableHead className="text-right w-28">
                    Harga Satuan
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((fieldd, index) => (
                  <TableRow key={index}>
                    {/* <TableCell className="font-medium ">
                      <FormField
                        control={form.control}
                        name={`invoices.${index}.namaBarang`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                placeholder="Nama Barang"
                                className="resize-none w-45"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="absolute" />
                          </FormItem>
                        )}
                      />
                    </TableCell> */}
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`invoices.${index}.desc`}
                        render={({ field }) => (
                          <FormItem className="">
                            <FormControl>
                              <Textarea
                                placeholder="Nama, Jenis dan Ukuran"
                                className="resize-none md:w-full w-95"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="absolute" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`invoices.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                inputMode="numeric"
                                placeholder="Quantity"
                                className="resize-none"
                                {...field}
                                onChange={(event) =>
                                  field.onChange(
                                    isNaN(Number(event.target.value))
                                      ? ""
                                      : +event.target.value
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage className="absolute" />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <FormField
                        control={form.control}
                        name={`invoices.${index}.price`}
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
                                      ? ""
                                      : +event.target.value
                                  )
                                }
                              />
                            </FormControl>
                            <FormDescription>
                              <NumericFormat
                                value={field.value}
                                displayType={"text"}
                                prefix={"Rp."}
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
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem className="mb-10">
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
                      prefix={"Rp."}
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
              control={form.control}
              name="delivery"
              render={({ field }) => (
                <FormItem className="mb-10">
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
                      prefix={"Rp."}
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
              control={form.control}
              name="tax"
              render={({ field }) => (
                <FormItem className="mb-10">
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
                      className="absolute mt-2"
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
              control={form.control}
              name="dp"
              render={({ field }) => (
                <FormItem className="mb-10">
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
                      className="absolute mt-2"
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
              control={form.control}
              name="estimatedTime"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-10">
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
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <Button
              type="button"
              variant="secondary"
              onClick={() => calculate()}
            >
              Refresh
            </Button>
            {isClient ? (
              <div>
                <PDFDownloadLink
                  document={<InvoiceGenerator data={form.getValues()} />}
                  fileName={
                    form.getValues("invoiceNumber").replace(".", "_") +
                    "-" +
                    form.getValues("type") +
                    "-" +
                    form.getValues("company")
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
            ) : null}
            <Button type="submit" variant="default">
              Save
            </Button>
            {params?.transaction && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => submitCopy(form.getValues())}
              >
                Make a Copy
              </Button>
            )}
          </div>
        </form>
      </Form>
      <h2 className="text-2xl font-bold tracking-tight">Preview</h2>

      {isClient ? (
        <div>
          <PDFViewer width="100%" height="1000px">
            <InvoiceGenerator data={form.getValues()} />
          </PDFViewer>

          <PDFDownloadLink
            document={<InvoiceGenerator data={form.getValues()} />}
            fileName={
              form.getValues("invoiceNumber") +
              "-" +
              form.getValues("type") +
              "-" +
              form.getValues("company") +
              ".pdf"
            }
          >
            {({ loading }) =>
              loading ? (
                <button>Loading Document...</button>
              ) : (
                <button>Download</button>
              )
            }
          </PDFDownloadLink>
        </div>
      ) : null}
    </>
  );
};

export default TransactionForm;
