"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { ChevronLeft, Loader2, PlusCircle, X } from "lucide-react";
import { numbering } from "@/lib/utils";
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
import {
  Table,
  TableBody,
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
import { NumericFormat } from "react-number-format";
import moment from "moment";
import { useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  profileFormSchema,
  ProfileFormValues,
  SalesType,
} from "@/types/transaction-schema.d";
import { createTransaction, updateTransaction } from "@/lib/transaction/utils";
import ContactDetailComponent from "./components/contactDetails";

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
  merchant_id: 0,
  company: "",
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
  type: SalesType.penawaran,
  invoiceDueDate: moment().format("D MMMM YYYY"),
  invoiceDate: moment().format("D MMMM YYYY"),
  invoiceNumber: numbering("Penawaran"),
  estimatedTime: "1 sampai 2 minggu",
  isPreSigned: true,
  payment_status: "UNPAID",
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
    calculate();
    data.subtotal = form.getValues("subtotal");
    data.total = form.getValues("total");

    console.log("Submit", JSON.stringify(data, null, 2));
    params.transaction
      ? await updateTransaction(
          data,
          session?.user.merchant_id,
          params.transaction
        )
      : await createTransaction(data, session?.user.merchant_id);
  }

  function calculate() {
    console.log("calculate");

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
  }, [form, item, params?.transaction]);
  useEffect(() => {
    setIsClient(true);
    const cnt = localStorage.getItem("count");
    setItem(cnt ? cnt : "");
    // autoFill(
    //   "Nama: Tri Wahyuningsih\nNama PT: PT LIWAYWAY\nAlamat pengiriman: Jl.Jababrka XVII B Blok U5A kawasan industri jababeka 1 cikarang utara bekasi\nNo HP:081284435350\nEmail:purchasing3@oishi.co.id "
    // );
  }, []);

  function radioOnChange(...event: any[]) {
    form.setValue("type", event[0]);
    form.setValue("invoiceNumber", numbering(form.getValues("type"), item));
  }
  const router = useRouter();
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
                {params?.transaction
                  ? form.getValues("invoiceNumber")
                  : "Add New Transaction"}
              </h1>
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
                    variant="default"
                    onClick={() => submitCopy(form.getValues())}
                  >
                    Make a Copy
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Row 1 */}
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <div className="md:hidden gap-4 grid">
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
                      control={form.control}
                      name="type"
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
              </div>
              <Card>
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Transaction Details
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Add transaction details.
                  </CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col space-y-8 lg:flex-row">
                  <div className="flex-1 my-5">
                    <div className="space-y-8 ">
                      <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Invoice Number#</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="07/CTS/W/VIII/2023"
                                {...field}
                              />
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
                                <Input
                                  placeholder="10 Oktober 2023"
                                  {...field}
                                />
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
                  </div>
                </CardContent>
              </Card>
              <ContactDetailComponent form={form} />
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
                    control={form.control}
                    name="type"
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
            </div>
          </div>

          {/* Row 2 */}
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
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={() =>
                      append({
                        namaBarang: "",
                        desc: "",
                        quantity: 1,
                        price: 0,
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
                      control={form.control}
                      name="discount"
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
                      name="dp"
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
                    control={form.control}
                    name="estimatedTime"
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
                    control={form.control}
                    name="isPreSigned"
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
                variant="default"
                onClick={() => submitCopy(form.getValues())}
              >
                Make a Copy
              </Button>
            )}
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {isClient ? (
                  <div>
                    <PDFViewer width="100%" height="700px" showToolbar={false}>
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
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </>
  );
};

export default TransactionForm;
