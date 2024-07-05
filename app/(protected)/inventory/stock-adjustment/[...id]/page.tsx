"use client";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
  StockAdjustment,
  StockAdjustmentDefaultValues,
  StockAdjustmentSchema,
} from "@/types/stock-adjustment.d";
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
  createStockAdjustment,
  getStockAdjustment,
  updateStockAdjustment,
} from "@/lib/inventory/stock-adjustment/utils";
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
import { cn, getRunningNumber } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { getProducts } from "@/lib/inventory/products/utils";
import { Product } from "@/types/product";

const StockAdjustmentPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Array<Product>>([]);
  const router = useRouter();
  const form = useForm<StockAdjustment>({
    resolver: zodResolver(StockAdjustmentSchema),
    defaultValues: StockAdjustmentDefaultValues,
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "details",
    control: form.control,
  });

  const watch = form.watch("details");

  async function onSubmit(data: StockAdjustment) {
    params?.id != "new"
      ? await updateStockAdjustment(
          data,
          session?.user.merchant_id,
          params?.id,
          router
        )
      : await createStockAdjustment(data, session?.user.merchant_id, router);
  }
  useEffect(() => {
    async function get() {
      params?.id != "new" && form.reset(await getStockAdjustment(params?.id));
      if (session?.user.merchant_id) {
        const resp = await getProducts(session?.user.merchant_id);
        setProducts(resp);
        form.setValue(
          "transaction_number",
          await getRunningNumber(session?.user.merchant_id, "stock")
        );
      }
    }
    get();
  }, [params?.id, session?.user.merchant_id]);

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
                  : form.getValues("transaction_number")}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              {params?.id == "new" && (
                <div className="flex flex-col md:flex-row gap-5">
                  <Button
                    type="submit"
                    onClick={() => form.handleSubmit(onSubmit)}
                  >
                    + Create Stock Adjustment
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle>Stock Adjustment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 grid-cols-2">
                  <FormField
                    control={form.control}
                    name="transaction_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transaction Number</FormLabel>
                        <FormControl>
                          {params?.id != "new" ? (
                            <p>{field.value}</p>
                          ) : (
                            <Input placeholder="000/000/000" {...field} />
                          )}
                        </FormControl>
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sa_category_label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          {params?.id != "new" ? (
                            <p>{field.value}</p>
                          ) : (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue="gr"
                              value={field.value}
                            >
                              <SelectTrigger className="">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">General</SelectItem>
                                <SelectItem value="production">
                                  Production
                                </SelectItem>
                                <SelectItem value="opening_qty">
                                  Opening Quantity
                                </SelectItem>
                                <SelectItem value="waste">Waste</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage className="" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="transaction_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full pt-1">
                        <FormLabel className="pb-1">Transaction Date</FormLabel>
                        <FormControl>
                          {params?.id != "new" ? (
                            <p>{field.value.toLocaleDateString("en-US")}</p>
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
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
                        <TableHead className="w-1/4">Product</TableHead>
                        <TableHead className="w-1/4">
                          Recorded Quantity
                        </TableHead>
                        <TableHead className="w-1/4">Actual quantity</TableHead>
                        <TableHead className="w-2/4">Difference</TableHead>
                        <TableHead className="w-1/4">Average Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {watch.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`details.${index}.product_id`}
                              render={({ field }) => (
                                <FormItem className="">
                                  <FormControl>
                                    {params?.id != "new" ? (
                                      <p>
                                        {
                                          products.find(
                                            (product: Product) =>
                                              product.product_id == field.value
                                          )?.name
                                        }
                                      </p>
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
                            {products.find(
                              (product: Product) =>
                                product.product_id == detail.product_id
                            )?.qty ?? 0}
                            {
                              products.find(
                                (product: Product) =>
                                  product.product_id == detail.product_id
                              )?.unit
                            }
                          </TableCell>
                          <TableCell>
                            {Number(
                              products.find(
                                (product: Product) =>
                                  product.product_id == detail.product_id
                              )?.qty ?? 0
                            ) + Number(detail.difference ?? 0)}
                            {
                              products.find(
                                (product: Product) =>
                                  product.product_id == detail.product_id
                              )?.unit
                            }
                          </TableCell>
                          <TableCell className="grid items-center">
                            <FormField
                              control={form.control}
                              name={`details.${index}.difference`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    {params?.id != "new" ? (
                                      <p>{field.value}</p>
                                    ) : (
                                      <Input
                                        inputMode="none"
                                        placeholder="Difference"
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
                                    )}
                                  </FormControl>
                                  <FormMessage className="absolute" />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <NumericFormat
                              value={
                                products.find(
                                  (product: Product) =>
                                    product.product_id == detail.product_id
                                )?.buy.buy_price ?? 0
                              }
                              displayType={"text"}
                              prefix={"Rp"}
                              allowNegative={false}
                              decimalSeparator={","}
                              thousandSeparator={"."}
                              fixedDecimalScale={true}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            {params?.id != "new" ? (
                              <></>
                            ) : (
                              <Button
                                variant="outline"
                                size="icon"
                                type="button"
                                onClick={() => remove(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <Separator />
              {params?.id != "new" ? (
                <></>
              ) : (
                <CardFooter className="justify-center border-t p-4">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    onClick={() =>
                      append({
                        product_id: 0,
                        difference: 0,
                      })
                    }
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
        </form>
      </Form>
    </>
  );
};

export default StockAdjustmentPage;
