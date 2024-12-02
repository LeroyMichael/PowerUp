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
import { useState } from "react";

import { NumericFormat } from "react-number-format";
import {
  DialogState,
  PaymentDialogProps,
} from "../../sales/components/sales-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarIcon } from "lucide-react";
import { formatDateID } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

type TExpensesTableProps = {
  data: ExpenseListSchema[];
  callRefetchList: () => void;
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  selectedDate,
  onDateChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[325px]">
        <DialogHeader>
          <DialogTitle>Process Payment</DialogTitle>
          <DialogDescription>Select payment date</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="border p-2 text-left flex items-center">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? formatDateID(selectedDate) : "Pick a payment date"}
          </div>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onDateChange}
            initialFocus
          />
        </div>
        <DialogFooter>
          <div className="flex justify-center w-100">
            <Button className="w-100" onClick={onSubmit}>
              Process Payment
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ExpensesTable = ({ data, callRefetchList }: TExpensesTableProps) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const handleDateChange = (date: Date | undefined): void => {
    if (date) {
      setSelectedDate(date);
    }
  };
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    selectedId: 0,
    status: "",
  });

  async function callDeleteExpense(expense_id: number) {
    await deleteExpense(expense_id).then(callRefetchList);
  }

  async function callActivateExpense(expense_id: number) {
    await activateExpense(expense_id).then(callRefetchList);
  }

  async function callMarkAsPaidExpense() {
    console.log(
      `Processing payment for ID ${dialogState.selectedId} on date ${selectedDate} with status ${dialogState.status}`
    );
    if (dialogState.status == "ACTIVE") {
      await payExpense(dialogState.selectedId, selectedDate).then(
        callRefetchList
      );

      return;
    }

    await activateExpense(dialogState.selectedId)
      .then(() => payExpense(dialogState.selectedId, selectedDate))
      .then(callRefetchList);
    setDialogState({ isOpen: false, selectedId: 0, status: "" });
  }
  // Handlers
  const handlePayment = (id: number, sts: String): void => {
    setDialogState({ isOpen: true, selectedId: id, status: sts });
  };

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
              <TableRow key={expense.expense_id + idx}>
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
                          handlePayment(
                            expense.expense_id,
                            expense.status ?? "DRAFT"
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
      <PaymentDialog
        open={dialogState.isOpen}
        onClose={() =>
          setDialogState({ isOpen: false, selectedId: 0, status: "" })
        }
        onSubmit={callMarkAsPaidExpense}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default ExpensesTable;
