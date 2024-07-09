import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

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
import CustomerCard from "@/components/atoms/customer-card";

export default function ExpenseBeneficiaryDetails({isUpdate}: { isUpdate: boolean}){
  const { data: session} = useSession()

  const { control, getValues, setValue, watch, formState: {errors} } = useFormContext<ExpensesFormDataType>()
  
  const watchForm = watch()

  const [ customerLists, setCustomerLists] = useState<Contact[]>([])
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  const [ lastPage, setLastPage ] = useState<number>(1)
  const [ search, setSearch ] = useState<string>("")
  const [ selectedCustomer, setSelectedCustomer ] = useState<Contact | null>(null)

  const selectCustomer = (item: Contact) => {
    setValue("contact_id", item.contact_id ?? 0)
    setSelectedCustomer(item)
  }

  const debounceSearchFilter = useMemo(() => 
      debounce((value: string) => {
        setSearch(value)
      }, 1000)
  ,[])

  const searchContacts = (search: string) => {
    debounceSearchFilter(search)
  };

  async function callCustomerLists(merchant_id: string, currentPage: number, searchParam: string){
    const tempList = await getContacts(merchant_id, currentPage, searchParam)
    setCustomerLists(tempList.data)
    setLastPage(tempList.meta.last_page)

    if(tempList && selectedCustomer === null && isUpdate){
      setSelectedCustomer(getValues("contact_name") ?? null)
    }
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
          {selectedCustomer && 
            <div className="mb-4">
              <div>Current Contact</div>
              <CustomerCard
                isSelected={true}
                data={selectedCustomer}
              />
              <Separator className="mt-4"/>
            </div>
          }
          <ScrollArea className="h-[300px]">
            <div className="grid md:grid-cols-2 gap-5 ">
              {customerLists?.map((customer) => {
                return (
                  <CustomerCard
                    key={customer.contact_id}
                    isSelected={watchForm.contact_id === customer.contact_id}
                    onClick={selectCustomer}
                    data={customer}
                  />
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