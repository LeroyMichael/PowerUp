import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { Purchase } from "@/types/purchase"
import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { getContacts } from "@/lib/contacts/utils"
import { Contact } from "@/types/contact"

export default function PurchaseCustomerDetails({}){
  const { data: session} = useSession()
  const { control, setValue, watch } = useFormContext<Purchase>()
  
  const watchForm = watch()

  const [ customerLists, setCustomerLists] = useState<Contact[]>([])
  const [ tempCustomerList, setTempCustomerList ] = useState<Contact[]>(customerLists)
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ lastPage, setLastPage ] = useState<number>(1)

  const selectCustomer = (item: Contact) => {
    setValue("contact_id", item.contact_id ?? 0)
  }

  const searchContacts = (filter: string) => {
    setTempCustomerList(
      customerLists.filter((customer) => JSON.stringify(customer).toLowerCase().includes(filter.toLowerCase()))
    );
  };

  // TODO: Fix this search logic when BE Provide Search param

  // Ini gak akan work as expected karena di search per page, sedangkan datanya nggak ad di page itu
  // sebaiknya ketika search, dibikin hit ke BE, pakai setTimeout supaya nggak spam BEnya juga
  async function callCustomerLists(merchant_id: string, currentPage: number){
    const tempList = await getContacts(merchant_id, currentPage)
    setCustomerLists(tempList.data)
    setLastPage(tempList.meta.last_page)
    
    // if(customerLists.length === 0){
      setTempCustomerList(tempList.data)
    // }
  }

  useEffect(() => {
    if(session?.user.merchant_id){
      callCustomerLists(session?.user.merchant_id, currentPage)
    }
  }, [session?.user.merchant_id, currentPage])

  useEffect(() => {
    setTempCustomerList(customerLists)
  }, [customerLists])


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
                      <FormMessage className="absolute" />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
                      watchForm.contact_id === customer.contact_id &&
                        "bg-muted"
                    )}
                    onClick={() => selectCustomer(customer)}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold">
                            {customer.company_name} /{" "}
                            {customer.display_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-medium">
                        {customer.phone_number}
                      </div>
                      <div className="text-xs font-medium">
                        Email
                        {customer.email}
                      </div>
                    </div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {customer.delivery_address}
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
                  currentPage >= 1 &&
                  setCurrentPage(currentPage - 1)
                }
                style={{ display: currentPage === 1 ? "none" : "flex" }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() =>
                  currentPage != lastPage &&
                  setCurrentPage(currentPage + 1)
                }
                style={{
                  display:
                    currentPage === lastPage ? "none" : "flex",
                }}
              >
                Next
              </Button>
            </div>
        </CardContent>
      </Card>
    )
}