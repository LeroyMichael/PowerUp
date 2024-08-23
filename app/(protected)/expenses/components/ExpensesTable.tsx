import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  activateExpense,
  deleteExpense,
  payExpense,
} from "@/lib/expenses/utils";
import { ExpenseListSchema } from "@/types/expenses";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { NumericFormat } from "react-number-format";

type TExpensesTableProps = {
  data: ExpenseListSchema[];
  callRefetchList: () => void;
};

const ExpensesTable = ({ data, callRefetchList }: TExpensesTableProps) => {
  const router = useRouter();

  async function callDeleteExpense(expense_id: number) {
    await deleteExpense(expense_id).then(callRefetchList);
  }

  async function callActivateExpense(expense_id: number) {
    await activateExpense(expense_id).then(callRefetchList);
  }

  async function callMarkAsPaidExpense(expense_id: number, isActive: boolean) {
    if (isActive) {
      await payExpense(expense_id).then(callRefetchList);

      return;
    }

    await activateExpense(expense_id)
      .then(() => payExpense(expense_id))
      .then(callRefetchList);
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Expense Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Beneficiary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((expense, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                      >
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] ">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() =>
                          router.push(`/expenses/${expense.expense_id}`)
                        }
                      >
                        Make a copy
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => callDeleteExpense(expense.expense_id)}
                      >
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => callActivateExpense(expense.expense_id)}
                        disabled={expense.status === "ACTIVE"}
                      >
                        Activate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          callMarkAsPaidExpense(
                            expense.expense_id,
                            expense.status === "ACTIVE"
                          )
                        }
                        disabled={expense.payment_status === "PAID"}
                      >
                        Mark as paid
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/expenses/${expense.expense_id}`}
                    className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                  >
                    {expense.transaction_number}
                  </Link>
                </TableCell>
                <TableCell>{expense.transaction_date}</TableCell>
                <TableCell>
                  {expense.contact_name?.first_name ?? "Default Expense"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={expense.status === "ACTIVE" ? "paid" : "draft"}
                  >
                    {expense.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      expense.payment_status === "PAID" ? "paid" : "draft"
                    }
                  >
                    {expense.payment_status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <NumericFormat
                    className="text-green-400"
                    value={expense.total}
                    displayType={"text"}
                    prefix={"Rp"}
                    allowNegative={false}
                    decimalSeparator={","}
                    thousandSeparator={"."}
                    fixedDecimalScale={true}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpensesTable;
