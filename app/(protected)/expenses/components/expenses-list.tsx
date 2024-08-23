"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  getExpensesLists,
  TGetExpensesListsParams,
} from "@/lib/expenses/utils";
import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import { ExpenseListSchema } from "@/types/expenses";
import ExpensesTable from "./ExpensesTable";

type TExpensesTableProps = {
  data: ExpenseListSchema[];
  callRefetchList: () => void;
};

const ExpensesList = () => {
  const { data: session } = useSession();

  const [data, setData] = useState<ExpenseListSchema[]>([]);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);

  const debounceSearchExpenses = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
        setCurrentPage(1);
      }, 1000),
    []
  );

  const searchExpenses = (searchValue: string) => {
    debounceSearchExpenses(searchValue);
  };

  const callGetExpensesLists = async (
    merchant_id: number,
    search: string,
    page: number
  ) => {
    const filter: TGetExpensesListsParams = {
      search: search,
      page: page,
    };
    const expenseLists = await getExpensesLists(merchant_id, filter);

    setData(expenseLists.data);
    setLastPage(expenseLists.meta.last_page);
  };

  useEffect(() => {
    if (session?.user.merchant_id) {
      callGetExpensesLists(session?.user.merchant_id, search, currentPage);
    }
  }, [session?.user.merchant_id, currentPage, search]);
  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-8"
          onChange={() => searchExpenses("testing")}
        />
      </div>
      <ExpensesTable
        data={data}
        callRefetchList={() =>
          callGetExpensesLists(session?.user.merchant_id, search, currentPage)
        }
      />

      <div className="flex items-center justify-end space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => currentPage >= 1 && setCurrentPage(currentPage - 1)}
          style={{ display: currentPage === 1 ? "none" : "flex" }}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() =>
            currentPage != lastPage && setCurrentPage(currentPage + 1)
          }
          disabled={currentPage === lastPage}
        >
          Next
        </Button>
      </div>
    </>
  );
};

export default ExpensesList;
