"use client";
import Link from "next/link";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
import InvoiceGenerator from "@/components/organisms/invoice-generator";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import AutoFill from "@/components/molecules/auto-fill";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NumericFormat } from "react-number-format";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const profileFormSchema = z.object({
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
  discount: z.number().optional(),
  type: z.enum(["Pro Invoice", "Invoice", "Penawaran"], {
    required_error: "You need to select a file type.",
  }),
  subtotal: z.number().optional(),
  tax: z.number().optional(),
  invoiceDate: z.string(),
  invoiceDueDate: z.string(),
  estimatedTime: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}
// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
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
  discount: 0,
  type: "Penawaran",
  invoiceDueDate: "",
  invoiceDate: "",
  invoiceNumber: "01/CTS/W/X/2023",
  estimatedTime: "1 sampai 2 minggu",
};

const GenerateInvoice = () => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "invoices",
    control: form.control,
  });

  async function onSubmit(data: ProfileFormValues) {
    calculate();
    // const result = await fetch("api/generateInvoice", {
    //   method: "POST",
    // });
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
    const subtotal = form
      .getValues("invoices")
      ?.reduce((a, c) => c.price * c.quantity + a, 0);

    form.setValue("subtotal", subtotal);
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

  useEffect(() => {
    setIsClient(true);
    // autoFill(
    //   "Nama: Tri Wahyuningsih\nNama PT: PT LIWAYWAY\nAlamat pengiriman: Jl.Jababrka XVII B Blok U5A kawasan industri jababeka 1 cikarang utara bekasi\nNo HP:081284435350\nEmail:purchasing3@oishi.co.id "
    // );
  }, []);
  return (
    <>
      <AutoFill autoFill={autoFill} />

      <Separator className="my-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-8 lg:max-w-2xl">
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
          </div>
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
              name="tax"
              render={({ field }) => (
                <FormItem className="mb-10">
                  <FormLabel>Tax</FormLabel>
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
                    />
                  </FormDescription>
                  <FormMessage className="absolute" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
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
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3 mt-10">
                  <FormLabel>Tipe Surat</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
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
          </div>
          <div className="flex">
            <Button type="submit" variant="secondary" className="mt-5">
              Refresh
            </Button>
            {isClient ? (
              <div>
                <PDFDownloadLink
                  document={<InvoiceGenerator data={form.getValues()} />}
                  fileName={
                    form.getValues("invoiceNumber") +
                    "-" +
                    form.getValues("type") +
                    "-" +
                    form.getValues("company")
                  }
                >
                  {({ loading }) =>
                    loading ? (
                      <button>Loading Document...</button>
                    ) : (
                      <>
                        <Button type="button" className="mt-5 ml-2">
                          Download
                        </Button>
                      </>
                    )
                  }
                </PDFDownloadLink>
              </div>
            ) : null}
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
              form.getValues("company")
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

export default GenerateInvoice;
