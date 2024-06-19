import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { Purchase } from "@/types/purchase"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

type TCustomerDataDummy = { 
  company_name: string,
  customer_name: string,
  vendor_id: number,
  billing_address: string,
  delivery_address: string,
  phone_number: string
}

export default function PurchaseCustomerDetails({}){

  const { control, formState: {errors} } = useFormContext<Purchase>()

  const customerDataDummy = [
    { company_name: "Power", customer_name: "Joko", vendor_id: 1, billing_address: "Rumah1", delivery_address: "Bukan rumah1", phone_number: "123123"},
    { company_name: "Up", customer_name: "Anwar", vendor_id: 2, billing_address: "Rumah2", delivery_address: "Bukan rumah2", phone_number: "1231234"},
    { company_name: "Website", customer_name: "Sumarjo", vendor_id: 3, billing_address: "Rumah3", delivery_address: "Bukan rumah3", phone_number: "1231235"},
    { company_name: "Power", customer_name: "Joko", vendor_id: 4, billing_address: "Rumah1", delivery_address: "Bukan rumah1", phone_number: "123123"},
    { company_name: "Up", customer_name: "Anwar", vendor_id: 5, billing_address: "Rumah2", delivery_address: "Bukan rumah2", phone_number: "1231234"},
    { company_name: "Website", customer_name: "Sumarjo", vendor_id: 6, billing_address: "Rumah3", delivery_address: "Bukan rumah3", phone_number: "1231235"},
    { company_name: "Power", customer_name: "Joko", vendor_id: 7, billing_address: "Rumah1", delivery_address: "Bukan rumah1", phone_number: "123123"},
    { company_name: "Up", customer_name: "Anwar", vendor_id: 8, billing_address: "Rumah2", delivery_address: "Bukan rumah2", phone_number: "1231234"},
    { company_name: "Website", customer_name: "Sumarjo", vendor_id: 9, billing_address: "Rumah3", delivery_address: "Bukan rumah3", phone_number: "1231235"}
  
  ]

  const selectCustomer = (item: TCustomerDataDummy) => {
    console.log('selected item', item)
  }

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Customer Details
          </CardTitle>
          <CardDescription>
            Add Customer Details
          </CardDescription>
        </CardHeader>
        <Separator/>
        <CardContent>
          <div className="flex flex-col gap-4 my-4">
            <div>
              <FormField
                control={control}
                name="billing_address"
                render={({field}) => (
                  <FormItem>
                      <FormLabel>Billing Address</FormLabel>
                      <Textarea
                        placeholder="e.g. Jalan Indonesia Blok C No. 22"
                        {...field}
                        />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="grid md:grid-cols-2 gap-5 ">
              {customerDataDummy?.map((customer) => {
                // const details = JSON.parse(customer.details);
                return (
                  <button
                    type="button"
                    key={customer.vendor_id}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                      // selectedCustomer === item.customer_id &&
                      //   "bg-muted"
                    )}
                    onClick={() => selectCustomer(customer)}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">
                            {customer.company_name} /{" "}
                            {customer.customer_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium">
                        {customer.phone_number}
                      </div>
                      <div className="text-xs font-medium">
                        Email
                        {/* {customer.email} */}
                      </div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {/* {customer.address} */}
                      Address
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    )
}