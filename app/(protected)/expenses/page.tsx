"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import ExpensesTable from "./ExpensesTable";
import { getExpensesLists, TGetExpensesListsParams } from "@/lib/expenses/utils";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import { ExpensesDataType } from "@/types/expenses";



const Page = () => {
    const { data: session } = useSession()

    const [ data, setData ] = useState<ExpensesDataType[]>([])
    const [ search, setSearch ] = useState<string>("")
    const [ currentPage, setCurrentPage ] = useState<number>(1)
    const [ lastPage, setLastPage ] = useState<number>(1)


    const debounceSearchExpenses = useMemo(() => 
        debounce((value: string) => {
        setSearch(value)
        setCurrentPage(1)
        }, 1000
    ),[])

    const searchExpenses = (searchValue: string) => {
        debounceSearchExpenses(searchValue)
    }

    const callGetExpensesLists = async (merchant_id: number, search: string, page: number) => {
        const filter: TGetExpensesListsParams = {
            search: search,
            page: page
        }
        const expenseLists = await getExpensesLists(merchant_id, filter)

        setData(expenseLists.data)
        setLastPage(expenseLists.meta.last_page)
    }


    useEffect(() => {
        if(session?.user.merchant_id){
            callGetExpensesLists(session?.user.merchant_id, search, currentPage)
        }
    }, [session?.user.merchant_id, currentPage, search])

    return (
      <Card>
        <CardHeader>
            <div className="flex w-100 justify-between items-center">
                <div className="flex flex-col space-y-1.5">
                    <CardTitle>Expenses</CardTitle>
                    <CardDescription>List of Expenses</CardDescription>
                </div>
                <div>
                    <Button size="sm" className="h-8 gap-1">
                        <Link href="/expenses/new" className="flex items-center gap-2">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Create Expenses
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div className="relative mb-4 w-1/3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search"
                    className="pl-8"
                    onChange={() => searchExpenses("testing")}
                />
            </div>
            <ExpensesTable data={data} callRefetchList={() => callGetExpensesLists(session?.user.merchant_id, search, currentPage)} />

            <div className="flex items-center justify-end space-x-2 p-4">
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

export default Page;