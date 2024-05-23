"use client";
import * as z from "zod";
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
import { Sale, SaleDefaultValues, SaleSchema } from "@/types/sale.d";
import { createSale, getSale, updateSale } from "@/lib/sales/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { updateLocale } from "moment";

// async function getData(sale_id: string, merchant_id: string) {
//   return getSale();
// }

const SalePage = ({ params }: { params: { sale: string } }) => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const form = useForm<Sale>({
    resolver: zodResolver(SaleSchema),
    defaultValues: SaleDefaultValues,
    mode: "onChange",
  });

  async function onSubmit(data: Sale) {
    params?.sale != "new"
      ? await updateSale(data, session?.user.merchant_id, params?.sale)
      : await createSale(data, session?.user.merchant_id);

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
      params?.sale != "new" && form.reset(await getSale(params?.sale));
    }
    get();
  }, [params?.sale, session?.user]);

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
                {params?.sale == "new"
                  ? "New Sale"
                  : form.getValues("transaction_number")}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <div className="flex flex-col md:flex-row gap-5">
                <Button>
                  {params?.sale == "new" ? "+ Add New Sale" : "Save"}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sale Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <FormField
                      control={form.control}
                      name="transaction_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transaction No</FormLabel>
                          <FormControl>
                            <Input placeholder="CTS/0219200/10" {...field} />
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
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default SalePage;
