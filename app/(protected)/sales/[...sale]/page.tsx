"use client";
import { useState } from "react";
import { useFieldArray } from "react-hook-form";
import { ChevronLeft, Loader2, PlusCircle, X } from "lucide-react";
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ComboboxProduct } from "@/components/ui/combo-box-product";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumericFormat } from "react-number-format";
import { Sale, SaleDefaultValues, SaleSchema } from "@/types/sale.d";
import { createSale, getSale, updateSale } from "@/lib/sales/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { getRunningNumber } from "@/lib/utils";

import { getProducts } from "@/lib/inventory/products/utils";
import { Product } from "@/types/product";
import ContactDetailComponent from "./contactDetail";
import SalesInformationComponent from "./salesInformation";
import SelectWallet from "@/components/form/wallet/select-wallet";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import ExportInvoice from "@/components/organisms/export/export-invoice";
import {
  ExportInvoiceType,
  ExportInvoiceSchema,
} from "@/types/export-invoice.d";
import { convertExportInvoiceMutation } from "@/lib/export-invoice/utils";
import { getMerchants } from "@/lib/merchant/utils";

const SalePage = ({ params }: { params: { sale: string } }) => {
  const { data: session } = useSession();

  const router = useRouter();

  const [currentSubtotal, setCurrentSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const formsales = useForm<Sale>({
    resolver: zodResolver(SaleSchema),
    defaultValues: SaleDefaultValues,
    mode: "onChange",
  });

  const formExportInvoice = useForm<ExportInvoiceType>({
    resolver: zodResolver(ExportInvoiceSchema),
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control: formsales.control,
  });

  async function onSubmit(
    data: Sale,
    isPaid: boolean = false,
    isCopy: boolean = false
  ) {
    if (isCopy)
      formsales.setValue(
        "transaction_number",
        await getRunningNumber(session?.user.merchant_id, "sale")
      );

    data.merchant_id = session?.user.merchant_id;
    calculate();
    data.subtotal = formsales.getValues("subtotal");
    data.total = formsales.getValues("total");
    console.log("Submit", JSON.stringify(data, null, 2));
    if (params.sale == "new") {
      createSale(data, session?.user.merchant_id, router, isPaid);
    } else {
      formsales.getValues("status") &&
        updateSale(
          data,
          session?.user.merchant_id,
          router,
          Number(params.sale),
          isPaid
        );
    }
  }

  async function onSubmitPaid(data: Sale) {
    await onSubmit(data, true);
  }

  async function onSubmitCopy(data: Sale) {
    await onSubmit(data, false, true);
  }

  async function onSubmitUnpaid(data: Sale) {
    await onSubmit(data, false);
  }

  function calculate() {
    console.log("calculate");

    const tax_rate = formsales.getValues("tax_rate");
    const delivery = formsales.getValues("delivery_amount") ?? 0;

    if (formsales.getValues("discount_type") === "FIX") {
      formsales.setValue(
        "discount_price_cut",
        formsales.getValues("discount_value")
      );
    }
    const discount_price_cut = formsales.getValues("discount_price_cut") ?? 0;
    const subtotal =
      formsales
        .getValues("details")
        ?.reduce(
          (a: number, c: { unit_price: any; qty: any }) =>
            Number(c.unit_price) * Number(c.qty) + a,
          0
        ) ?? 0;

    const totalAfterDiscount = subtotal - discount_price_cut;
    const tax = totalAfterDiscount * (tax_rate / 100);
    const afterTax = totalAfterDiscount + tax;
    const total = afterTax + delivery;

    setCurrentSubtotal(subtotal);
    formsales.setValue("tax", tax);
    formsales.setValue("subtotal", subtotal);
    formsales.setValue("total", total);
    console.log("items ", formsales.getValues());
    formExportInvoice.reset(
      convertExportInvoiceMutation({
        sale_data: formsales.getValues(),
      })
    );
  }

  const dpTypes = [
    { text: "Rate", value: "RATE" },
    { text: "Fix", value: "FIX" },
  ];

  const [dp_type, setDp_type] = useState("RATE");
  useEffect(() => {
    async function fetchData() {
      if (!session?.user.merchant_id) {
        return;
      }
      setProducts(
        await getProducts(session?.user.merchant_id, { page: 1, perPage: 999 })
      );

      if (params?.sale != "new") {
        formsales.reset(await getSale(params?.sale));
        formsales.setValue("merchant", {
          ...(await getMerchants(session?.user.id).then(
            (merchants: Record<string, any>) =>
              merchants.find(
                (merchant: any) =>
                  merchant.merchant_id == session?.user.merchant_id
              )
          )),
          admin_name: `${session?.user.first_name} ${session?.user.last_name}`,
        });

        calculate();
        return;
      }

      formsales.setValue(
        "transaction_number",
        await getRunningNumber(session?.user.merchant_id, "sale")
      );
      formsales.setValue("merchant", {
        ...(await getMerchants(session?.user.id).then(
          (merchants: Record<string, any>) =>
            merchants.find(
              (merchant: any) =>
                merchant.merchant_id == session?.user.merchant_id
            )
        )),
        admin_name: `${session?.user.first_name} ${session?.user.last_name}`,
      });
      calculate();
    }
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, [params?.sale, session?.user]);

  const [products, setProducts] = useState<Array<Product>>([]);
  const {
    handleSubmit,
    formState: { errors },
  } = formsales;
  const calculateAmount = (
    e: number | string,
    currentProductUnitPrice: number | string
  ) => {
    const tempQty = Number(e);
    return tempQty * Number(currentProductUnitPrice);
  };

  return (
    <>
      <Alert
        className="mb-3"
        variant="destructive"
        style={{
          display: formsales.getValues("status") == "DRAFT" ? "none" : "block",
        }}
      >
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>
          You cannot edit this sales because it&apos;s not a draft.
        </AlertDescription>
      </Alert>
      <Form {...formsales}>
        <form onSubmit={formsales.handleSubmit(onSubmitUnpaid)}>
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
              <Button
                type="button"
                variant="secondary"
                onClick={() => calculate()}
              >
                Refresh
              </Button>
              <PDFDownloadLink
                document={
                  <ExportInvoice data={formExportInvoice.getValues()} />
                }
                fileName={
                  formsales.getValues("transaction_number")?.replace(".", "_") +
                  "-" +
                  formsales.getValues("transaction_type") +
                  "-" +
                  formsales.getValues("contact.company_name")
                }
                className="w-full"
              >
                {({ loading }) =>
                  loading ? (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full md:w-auto"
                    >
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading..
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full md:w-auto"
                    >
                      Download
                    </Button>
                  )
                }
              </PDFDownloadLink>
              {params?.sale != "new" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onSubmitCopy(formsales.getValues())}
                >
                  Make a Copy
                </Button>
              )}
              {/* if it's not draft, the save button will be hidden and hide one button if it's edit*/}
              {formsales.getValues("status") == "DRAFT" && (
                <div className="flex flex-col md:flex-row gap-5">
                  <Button onClick={handleSubmit(onSubmitUnpaid)}>
                    {params?.sale == "new" ? "Create" : "Update"}
                  </Button>
                </div>
              )}

              {formsales.getValues("status") == "DRAFT" && (
                <div className="flex flex-col md:flex-row gap-5">
                  <Button onClick={handleSubmit(onSubmitPaid)}>
                    {params?.sale == "new" ? "Create & Pay" : "Update & Pay"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            {/* SALES INFROMATION AND CONTACT DETAIL PART */}
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <SalesInformationComponent formsales={formsales} />
              <ContactDetailComponent formsales={formsales} params={params} />
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
                  <SelectWallet />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ROW 2*/}
          <div className="grid pt-4 auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
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
                        <TableHead className="">Description</TableHead>
                        <TableHead className="">Quantity</TableHead>
                        <TableHead className="">Unit</TableHead>
                        <TableHead className="text-right w-28">
                          Harga Satuan
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((product, index) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <FormField
                              control={formsales.control}
                              name={`details.${index}.product_id`}
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormControl>
                                    {params?.sale != "new" &&
                                    formsales.getValues("status") != "DRAFT" ? (
                                      <p>
                                        {
                                          products.find(
                                            (e: Product) =>
                                              e.product_id == field.value
                                          )?.name
                                        }
                                      </p>
                                    ) : (
                                      <ComboboxProduct
                                        items={products}
                                        onValueChange={(e) => {
                                          field.onChange(Number(e));
                                          const unit_price = Number(
                                            products.find(
                                              (prod: Product) =>
                                                prod.product_id == Number(e)
                                            )?.sell.sell_price
                                          );
                                          formsales.setValue(
                                            `details.${index}.unit_price`,
                                            unit_price
                                          );
                                          formsales.setValue(
                                            `details.${index}.unit`,
                                            products.find(
                                              (e: Product) =>
                                                e.product_id ==
                                                formsales.getValues(
                                                  `details.${index}.product_id`
                                                )
                                            )?.unit
                                          );
                                          formsales.setValue(
                                            `details.${index}.amount`,
                                            calculateAmount(
                                              unit_price,
                                              Number(
                                                formsales.getValues(
                                                  `details.${index}.qty`
                                                ) && 0
                                              )
                                            )
                                          );
                                          formsales.setValue(
                                            `details.${index}.product_name`,
                                            products.find(
                                              (prod: Product) =>
                                                prod.product_id == Number(e)
                                            )?.name
                                          );
                                          calculate();
                                        }}
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
                              name={`details.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Description"
                                      className="resize-none"
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
                          <TableCell>
                            {formsales.getValues(`details.${index}.unit`)}
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
                                      onChange={(event) => {
                                        field.onChange(
                                          isNaN(Number(event.target.value))
                                            ? 0
                                            : +event.target.value
                                        );
                                        calculate();
                                      }}
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
                            <Button
                              variant="outline"
                              size="icon"
                              type="button"
                              onClick={() => remove(index)}
                            >
                              <X className="h-4 w-4" />
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
                <NumericFormat
                  value={currentSubtotal}
                  displayType={"text"}
                  prefix={"Subtotal: Rp"}
                  allowNegative={false}
                  decimalSeparator={","}
                  thousandSeparator={"."}
                  fixedDecimalScale={true}
                />
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
                      product_name: "",
                      currency_code: "IDR",
                      description: "",
                      qty: 1,
                      unit: "",
                      unit_price: 0,
                      amount: 0,
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
                    name="discount_price_cut"
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
                    name="delivery_amount"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Delivery</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="100000"
                            {...field}
                            onChange={(event) => {
                              field.onChange(
                                isNaN(Number(event.target.value))
                                  ? 0
                                  : +event.target.value
                              );
                              calculate();
                            }}
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
                    name="tax_rate"
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
                  <div className=" flex align-bottom">
                    <FormItem className="w-20">
                      <FormLabel>DP</FormLabel>
                      <Select
                        onValueChange={(e) => {
                          setDp_type(e);
                          formsales.setValue("down_payment_type", e);
                          formsales.setValue("down_payment_amount", 0);
                        }}
                        value={dp_type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Discount Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {dpTypes.map((type) => {
                            return (
                              <SelectItem key={type.value} value={type.value}>
                                {type.text}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage className="absolute" />
                    </FormItem>
                    <FormField
                      control={formsales.control}
                      name="down_payment_amount"
                      render={({ field }) => (
                        <FormItem className="mb-4">
                          <FormLabel>
                            {formsales.getValues("down_payment_type") ?? "RATE"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={
                                formsales.getValues("down_payment_type") ==
                                "RATE"
                                  ? "50%"
                                  : "500000"
                              }
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
                              prefix={
                                formsales.getValues("down_payment_type") ==
                                "FIX"
                                  ? "Rp"
                                  : ""
                              }
                              suffix={
                                formsales.getValues("down_payment_type") ==
                                "RATE"
                                  ? "%"
                                  : ""
                              }
                            />
                          </FormDescription>
                          <FormMessage className="absolute" />
                        </FormItem>
                      )}
                    />
                  </div>
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
                  name="memo"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Memo</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Memo"
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
                  name="is_last_installment"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Last Installment</FormLabel>
                      </div>
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
          <div className="flex flex-col md:flex-row gap-5 pt-5 mb-5">
            {/* if it's not draft, the save button will be hidden and hide one button if it's edit*/}
            {formsales.getValues("status") == "DRAFT" && (
              <div className="flex flex-col md:flex-row gap-5">
                <Button onClick={handleSubmit(onSubmitUnpaid)}>
                  {params?.sale == "new" ? "Create" : "Update"}
                </Button>
              </div>
            )}

            {formsales.getValues("status") == "DRAFT" && (
              <div className="flex flex-col md:flex-row gap-5">
                <Button onClick={handleSubmit(onSubmitPaid)}>
                  {params?.sale == "new" ? "Create & Pay" : "Update & Pay"}
                </Button>
              </div>
            )}
            {params?.sale != "new" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onSubmitCopy(formsales.getValues())}
              >
                Make a Copy
              </Button>
            )}
            <Button
              type="button"
              variant="secondary"
              onClick={() => calculate()}
            >
              Refresh
            </Button>
            <PDFDownloadLink
              document={<ExportInvoice data={formExportInvoice.getValues()} />}
              fileName={
                formsales.getValues("transaction_number")?.replace(".", "_") +
                "-" +
                formsales.getValues("transaction_type") +
                "-" +
                formsales.getValues("contact.company_name")
              }
              className="w-full"
            >
              {({ loading }) =>
                loading ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full md:w-auto"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading..
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full md:w-auto"
                  >
                    Download
                  </Button>
                )
              }
            </PDFDownloadLink>
          </div>
        </form>
      </Form>
      {!isLoading && (
        <PDFViewer width="100%" height="700px" showToolbar={false}>
          <ExportInvoice data={formExportInvoice.getValues()} />
        </PDFViewer>
      )}
    </>
  );
};

export default SalePage;
