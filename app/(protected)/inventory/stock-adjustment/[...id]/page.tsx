"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { NumericFormat } from "react-number-format";
import { Textarea } from "@/components/ui/textarea";
import {
  Product,
  ProductDefaultValues,
  ProductSchema,
} from "@/types/product.d";
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
import { useEffect } from "react";
import { getProduct, getProducts } from "@/lib/utils";

const StockAdjustmentPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const form = useForm<Product>({
    resolver: zodResolver(ProductSchema),
    defaultValues: ProductDefaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: Product) {
    console.log(data);
  }
  useEffect(() => {
    async function get() {
      const temp = await getProduct(params?.id);
      form.reset(temp);
    }
    get();
  }, [form, params?.id]);

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
                  ? "Add New Product"
                  : form.getValues("name")}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <div className="flex flex-col md:flex-row gap-5">
                <Button>Create Product</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Product Name" {...field} />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="SKU"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code / SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="SKU000" {...field} />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue="gr"
                              value={field.value}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pcs">pcs</SelectItem>
                                <SelectItem value="gr">gr</SelectItem>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="liter">liter</SelectItem>
                                <SelectItem value="cm">cm</SelectItem>
                                <SelectItem value="m">m</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Product for Tokopedia"
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
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Value</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="border">
                    <FormField
                      control={form.control}
                      name="buy.isBuy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-between p-4 items-center">
                          <FormLabel>Buying Price</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <div
                      className={
                        form.getValues("buy").isBuy.toString() == "false"
                          ? "hidden"
                          : ""
                      }
                    >
                      <Separator />
                      <div className="p-4 grid gap-4">
                        <FormField
                          control={form.control}
                          name="buy.buyPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Buy Unit Price</FormLabel>
                              <FormControl>
                                <Input
                                  inputMode="numeric"
                                  placeholder="Price"
                                  className=""
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
                              <FormMessage className="" />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="buy.buyAccountId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Buy Account</FormLabel>
                                <FormControl>
                                  <Combobox />
                                </FormControl>
                                <FormMessage className="absolute" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="buy.buyTaxId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Buy Tax</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue="PPN"
                                    value={field.value}
                                  >
                                    <SelectTrigger className="">
                                      <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PPN">PPN</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border">
                    <FormField
                      control={form.control}
                      name="sell.isSell"
                      render={({ field }) => (
                        <FormItem className="flex flex-row justify-between p-4 items-center">
                          <FormLabel>Selling Price</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <div
                      className={
                        form.getValues("sell").isSell.toString() == "false"
                          ? "hidden"
                          : ""
                      }
                    >
                      <Separator />
                      <div className="p-4 grid gap-4">
                        <FormField
                          control={form.control}
                          name="sell.sellPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Sell Unit Price</FormLabel>
                              <FormControl>
                                <Input
                                  inputMode="numeric"
                                  placeholder="Price"
                                  className=""
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
                              <FormMessage className="" />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="sell.sellAccountId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Sell Account</FormLabel>
                                <FormControl>
                                  <Combobox />
                                </FormControl>
                                <FormMessage className="absolute" />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="sell.sellTaxId"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Sell Tax</FormLabel>
                                <FormControl>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue="PPN"
                                    value={field.value}
                                  >
                                    <SelectTrigger className="">
                                      <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="PPN">PPN</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage className="" />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button className="md:hidden mb-10">Create Product</Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default StockAdjustmentPage;
