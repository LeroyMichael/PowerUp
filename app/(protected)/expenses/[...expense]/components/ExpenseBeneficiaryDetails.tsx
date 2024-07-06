import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

import { useFormContext } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { getContacts } from "@/lib/contacts/utils"
import { Contact } from "@/types/contact"
import { debounce } from "lodash"
import { ExpensesFormDataType } from "@/types/expenses"

export default function ExpenseBeneficiaryDetails({}){
  const { data: session} = useSession()
  const { control, setValue, watch, formState: {errors} } = useFormContext<ExpensesFormDataType>()
  
  const watchForm = watch()

  const [ customerLists, setCustomerLists] = useState<Contact[]>([])
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ lastPage, setLastPage ] = useState<number>(1)
  const [ search, setSearch ] = useState<string>("")

  const selectCustomer = (item: Contact) => {
    setValue("contact_id", item.contact_id ?? 0)
  }

  const debounceSearchFilter = useMemo(() => 
      debounce((value: string) => {
        setSearch(value)
      }, 1000),
      []
  )

  const searchContacts = (search: string) => {
    debounceSearchFilter(search)
  };

  async function callCustomerLists(merchant_id: string, currentPage: number, searchParam: string){
    const tempList = await getContacts(merchant_id, currentPage, searchParam)
    setCustomerLists(tempList.data)
    setLastPage(tempList.meta.last_page)
    
  }

  useEffect(() => {
    if(session?.user.merchant_id){
      callCustomerLists(session?.user.merchant_id, currentPage, search)
    }
  }, [session?.user.merchant_id, currentPage, search])

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Beneficiary Details
          </CardTitle>
          <CardDescription>
            Add Beneficiary Details
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
              {customerLists?.map((customer) => {
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
          {errors.contact_id?.message && (
            <p className="text-red-500">
              Please select Beneficiary
            </p>
          )}
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