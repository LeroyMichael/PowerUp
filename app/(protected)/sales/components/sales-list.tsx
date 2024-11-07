"use client";

import { Input } from "@/components/ui/input";
import { Sale, SaleList } from "@/types/sale.d";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { NumericFormat } from "react-number-format";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import {
  activateSale,
  deleteSale,
  getSales,
  paidSale,
} from "@/lib/sales/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarIcon, Search } from "lucide-react";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { cn, formatDateID, numberToPriceFormat, rupiah } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
interface DialogState {
  isOpen: boolean;
  selectedId: number;
  status: String;
}
interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  selectedDate: Date;
  onDateChange: (date: Date | undefined) => void;
}

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

const SalesList = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<Array<SaleList>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [isLoading, setLoading] = useState(true);
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    selectedId: 0,
    status: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const router = useRouter();
  const searchTrans = (term: string) => {
    debounceSearchFilter(term);
  };
  const debounceSearchFilter = useMemo(
    () =>
      debounce((value: string) => {
        get(value);
      }, 1000),
    []
  );
  // Handlers
  const handlePayment = (id: number, sts: String): void => {
    setDialogState({ isOpen: true, selectedId: id, status: sts });
  };
  const handleProcessPayment = async (): Promise<void> => {
    console.log(
      `Processing payment for ID ${dialogState.selectedId} on date ${selectedDate} with status ${dialogState.status}`
    );
    if (dialogState.selectedId == null) return;
    if (dialogState.status == "DRAFT") {
      await activateSale(dialogState.selectedId.toString()).then(
        async () =>
          await paidSale(
            dialogState.selectedId.toString(),
            selectedDate
          ).finally(() => get(""))
      );
    } else {
      await paidSale(dialogState.selectedId.toString(), selectedDate).finally(
        () => get("")
      );
    }
    setDialogState({ isOpen: false, selectedId: 0, status: "" });
  };
  const handleDateChange = (date: Date | undefined): void => {
    if (date) {
      setSelectedDate(date);
    }
  };

  async function get(search: String) {
    if (session?.user.merchant_id) {
      const res = await getSales(
        session?.user.merchant_id,
        currentPage,
        search
      );
      setLastPage(res.meta.last_page);
      setData(res.data);
    }
  }
  useEffect(() => {
    router.refresh();
    get("");
  }, [session?.user, currentPage]);

  return (
    <div className="flex-1 overflow-x-hidden">
      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search"
          className="pl-8"
          onChange={(e) => searchTrans(e.target.value)}
        />
      </div>

      <div className="rounded-md border w-full ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-5"></TableHead>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data ? (
              data.map((e, index) => {
                const estimated =
                  Number(e.subtotal) +
                  Number(e.delivery_amount) +
                  Number(e.tax) -
                  Number(e.discount_price_cut);
                return (
                  <TableRow key={e.sale_id}>
                    <TableCell>
                      <DropdownMenu modal={false}>
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
                          <DropdownMenuItem className="cursor-pointer">
                            <Link href={`/sales/${e.sale_id}`}>
                              Make a copy
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={async () => {
                              await deleteSale(e.sale_id.toString()).finally(
                                () => {
                                  setTimeout(() => get(""), 1000);
                                }
                              );
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={
                              e.status == "DRAFT"
                                ? "cursor-pointer text-black"
                                : "cursor-not-allowed text-slate-400 hover:text-slate-400 focus:text-slate-400"
                            }
                            onClick={async () => {
                              e.status == "DRAFT" &&
                                (await activateSale(e.sale_id.toString()).then(
                                  () => get("")
                                ));
                            }}
                          >
                            Activate
                          </DropdownMenuItem>
                          {e.transaction_type != "Penawaran" && (
                            <DropdownMenuItem
                              className={
                                e.payment_status == "UNPAID"
                                  ? "cursor-pointer text-black"
                                  : "cursor-not-allowed text-slate-400 hover:text-slate-400 focus:text-slate-400"
                              }
                              onClick={() => {
                                if (e.payment_status != "UNPAID") return;
                                handlePayment(e.sale_id, e.status ?? "DRAFT");
                              }}
                            >
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="capitalize">
                      <div className="w-[150px]">
                        {e.transaction_date.toString()}
                        <br />
                        {e.due_date.toString()} (Due Date)
                      </div>
                    </TableCell>
                    <TableCell>
                      {e.transaction_type}
                      <br />
                      {e.down_payment_amount != 0 &&
                        (e.down_payment_type == "RATE"
                          ? `(DP ${Number(e.down_payment_amount)}%)`
                          : `(DP Rp${numberToPriceFormat(
                              Number(e.down_payment_amount)
                            )})`)}
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/sales/${e.sale_id}`}
                        className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                      >
                        {e.transaction_number}
                      </Link>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link
                        href={`/sales/${e.sale_id}`}
                        className="text-sm font-medium transition-colors text-blue-500 hover:text-black"
                      >
                        {e.contact_name?.contact_type} -{" "}
                        {e.contact_name?.first_name}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">
                      <Badge variant={e.status == "DRAFT" ? "draft" : "paid"}>
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">
                      <Badge
                        variant={
                          e.payment_status == "UNPAID" ? "draft" : "paid"
                        }
                      >
                        {e.transaction_type == "Penawaran"
                          ? "-"
                          : e.payment_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <NumericFormat
                        className="text-green-400"
                        value={Number(e.total)}
                        displayType={"text"}
                        prefix={"Rp"}
                        allowNegative={true}
                        decimalSeparator={","}
                        thousandSeparator={"."}
                        fixedDecimalScale={true}
                      />
                      <br />
                      {e.down_payment_amount != 0 && (
                        <NumericFormat
                          className="text-muted-foreground"
                          value={estimated}
                          displayType={"text"}
                          prefix={"Rp"}
                          allowNegative={true}
                          decimalSeparator={","}
                          thousandSeparator={"."}
                          fixedDecimalScale={true}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell className="w-100 h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          style={{ display: currentPage == 1 ? "none" : "flex" }}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === lastPage}
        >
          Next
        </Button>
      </div>
      <PaymentDialog
        open={dialogState.isOpen}
        onClose={() =>
          setDialogState({ isOpen: false, selectedId: 0, status: "" })
        }
        onSubmit={handleProcessPayment}
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default SalesList;
