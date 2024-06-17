"use client";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Purchase,
  PurchaseDefaultValues,
  PurchaseSchema,
} from "@/types/purchase.d";
import CustomerDetails from "./components/CustomerDetails";
import SubtotalAndMemo from "./components/SubtotalAndMemo";
import TransactionDetails from "./components/TransactionDetails";
import PaymentMethod from "./components/PaymentMethod";
import AddProductTable from "./components/AddProductTable";


const PurchasePage = ({ params }: { params: { purchase: string } }) => {
  const methods = useForm<Purchase>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: PurchaseDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  async function onSubmit(data: Purchase) {
    console.log(data);
  }

  console.log('getValues', methods.watch())

  return (
    <>
      <FormProvider {...methods}>
        <div className="flex gap-4">
          <div className="w-2/3 flex flex-col gap-6">
            <TransactionDetails/>

            <CustomerDetails/>

            <AddProductTable/>

            <SubtotalAndMemo/>
          </div>

          <div className="w-1/3">
            <PaymentMethod/>
          </div>
        </div>
      </FormProvider>
      {/* <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
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
                {params?.purchase == "new"
                  ? "Add New Purchase"
                  : params?.purchase}
              </h1>
            </div>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <div className="flex flex-col md:flex-row gap-5">
                <Button>Save</Button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Information</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                  <div className="grid gap-4 mt-4">
                    <FormField
                      control={methods.control}
                      name="transactionNum"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Purchase Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="07/CTS/W/VIII/2023"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="" />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={methods.control}
                        name="transactionDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col w-full">
                            <FormLabel>Purchase Date</FormLabel>
                            <FormControl>
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
                            </FormControl>
                            <FormMessage className="" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={methods.control}
                        name="dueDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Purchase Due Date</FormLabel>
                            <FormControl>
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
                            </FormControl>
                            <FormMessage className="" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-0.5">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Purchase Details
                  </CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col lg:flex-row">
                  <Search />
                  <ScrollArea className="h-[300px]">
                    <div className="grid md:grid-cols-2 gap-5 ">
                      <ContactList></ContactList>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Details</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent>
                  <div className="grid gap-3 mt-4"></div>
                </CardContent>
              </Card>

              <Button className="md:hidden mb-10">Save</Button>
            </div>
          </div>
        </form>
      </Form> */}
    </>
  )
}

export default PurchasePage;
