"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
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
import { CalendarIcon, ChevronLeft, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { Textarea } from "@/components/ui/textarea";
import {
  Contact,
  ContactSchema,
  ContactDefaultValues,
} from "@/types/contact.d";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Combobox } from "@/components/ui/combo-box";
import { useEffect, useState } from "react";
import {
  createContact,
  getContact,
  getContacts,
  updateContact,
} from "@/lib/contacts/utils";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComboboxProduct } from "@/components/ui/combo-box-product";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { getProducts } from "@/lib/inventory/products/utils";
import { Product } from "@/types/product";

const ContactPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const router = useRouter();
  const form = useForm<Contact>({
    resolver: zodResolver(ContactSchema),
    defaultValues: ContactDefaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: Contact) {
    params?.id != "new"
      ? await updateContact(data, session?.user.merchant_id, params?.id)
      : await createContact(data, session?.user.merchant_id);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  useEffect(() => {
    async function get() {
      params?.id != "new" && form.reset(await getContact(params?.id));
    }

    async function fetchContacts() {
      if (session?.user.merchant_id) {
        const resp = await getContacts(session?.user.merchant_id);
        setContacts(resp);
      }
    }
    fetchContacts();
    get();
  }, [params?.id, session?.user]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
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
                {params?.id == "new"
                  ? "Add New StockAdjustment"
                  : form.getValues("contact_id")}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              {params?.id != "new" && (
                <div className="flex flex-col md:flex-row gap-5">
                  <Button
                    type="submit"
                    onClick={() => form.handleSubmit(onSubmit)}
                  >
                    Create Contact
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Name" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>a</p>
                            ) : (
                              <Input placeholder="Name" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Email" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Company" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Company" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="memo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            {params?.id != "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Textarea placeholder="Batch 001" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="billing_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Address</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Billing Address" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="delivery_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delivery Address</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Company" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Bank Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="bank_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Bank Name" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bank_holder"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Holder Name</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input
                                placeholder="Bank Holder Name"
                                {...field}
                              />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bank_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Number</FormLabel>
                          <FormControl>
                            {params?.id == "new" ? (
                              <p>{field.value}</p>
                            ) : (
                              <Input placeholder="Bank Number" {...field} />
                            )}
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card className="overflow-hidden">
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Contact Type
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Type of Contact
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col lg:flex-row">
                  <FormField
                    control={form.control}
                    name="contact_type"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue="Customer"
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Customer">Customer</SelectItem>
                              <SelectItem value="Vendor">Vendor</SelectItem>
                              <SelectItem value="Employee">Employee</SelectItem>
                              <SelectItem value="Others">Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <Separator />
                {params?.id != "new" ? (
                  <></>
                ) : (
                  <CardFooter className="justify-center border-t p-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="gap-1"
                      // onClick={() =>
                      //   append({
                      //     product_id: 0,
                      //     difference: 0,
                      //   })
                      // }
                    >
                      <PlusCircle className="h-3.5 w-3.5" />
                      Add New Item
                    </Button>
                  </CardFooter>
                )}
              </Card>
              {params?.id != "new" ? (
                <></>
              ) : (
                <Button type="submit" className="md:hidden mb-10">
                  Create Stock Adjustment
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default ContactPage;
