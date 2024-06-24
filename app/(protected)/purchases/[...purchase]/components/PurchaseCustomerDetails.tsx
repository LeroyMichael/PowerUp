import { FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { Purchase } from "@/types/purchase"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

type TCustomerDataDummy = { 
  company_name: string,
  customer_name: string,
  contact_id: number,
  billing_address: string,
  delivery_address: string,
  phone_number: string
}

export default function PurchaseCustomerDetails({}){

  const { control, formState: {errors}, setValue, getValues } = useFormContext<Purchase>()

  const customerDataDummy = [
    { company_name: "Power", customer_name: "Joko", contact_id: 1, billing_address: "Rumah1", delivery_address: "Bukan rumah1", phone_number: "123123"},
    { company_name: "Up", customer_name: "Anwar", contact_id: 2, billing_address: "Rumah2", delivery_address: "Bukan rumah2", phone_number: "1231234"},
    { company_name: "Website", customer_name: "Sumarjo", contact_id: 3, billing_address: "Rumah3", delivery_address: "Bukan rumah3", phone_number: "1231235"},
    { company_name: "Power1", customer_name: "Joko1", contact_id: 4, billing_address: "Rumah1", delivery_address: "Bukan rumah1", phone_number: "123123"},
    { company_name: "Up2", customer_name: "Anwar1", contact_id: 5, billing_address: "Rumah2", delivery_address: "Bukan rumah2", phone_number: "1231234"},
    { company_name: "Website3", customer_name: "Sumarjo1", contact_id: 6, billing_address: "Rumah3", delivery_address: "Bukan rumah3", phone_number: "1231235"},
    { company_name: "Power4", customer_name: "Joko2", contact_id: 7, billing_address: "Rumah1", delivery_address: "Bukan rumah1", phone_number: "123123"},
    { company_name: "Up5", customer_name: "Anwar2", contact_id: 8, billing_address: "Rumah2", delivery_address: "Bukan rumah2", phone_number: "1231234"},
    { company_name: "Website6", customer_name: "Sumarjo2", contact_id: 9, billing_address: "Rumah3", delivery_address: "Bukan rumah3", phone_number: "1231235"}
  ]

  const [ currentContactPage, setCurrentContactPage ] = useState(1)

  const [ tempCustomerList, setTempCustomerList ] = useState(customerDataDummy)

  const selectCustomer = (item: TCustomerDataDummy) => {
    setValue("contact_id", item.contact_id)
  }

  const searchContacts = (filter: string) => {
    setTempCustomerList(
      customerDataDummy.filter((customer) => JSON.stringify(customer).toLowerCase().includes(filter.toLowerCase()))
    );
  };

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
          <div className="relative mb-4 mt-3 w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Contact"
              className="pl-8"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[300px]">
            <div className="grid md:grid-cols-2 gap-5 ">
              {tempCustomerList?.map((customer) => {
                return (
                  <button
                    type="button"
                    key={customer.contact_id}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                      getValues("contact_id") === customer.contact_id &&
                        "bg-muted"
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
          <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  // currentContactPage >= 1 &&
                  // setCurrentContactPage(currentContactPage - 1)
                  console.log('current', currentContactPage)
                }
                style={{ display: currentContactPage == 1 ? "none" : "flex" }}
                // disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  // currentContactPage != contactLastPage &&
                  setCurrentContactPage(currentContactPage + 1)
                }
                // style={{
                //   display:
                //     currentContactPage == contactLastPage ? "none" : "flex",
                // }}
                // disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
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
        </CardContent>
      </Card>
    )
}