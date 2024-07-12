"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExpensesFormDataType, ExpensesDefaultValues, expensesFormData } from "@/types/expenses.d"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, SubmitHandler, useForm } from "react-hook-form"
import { getRunningNumber } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import ExpenseTransactionDetails from "./components/ExpenseTransactionDetails"
import ExpenseBeneficiaryDetails from "./components/ExpenseBeneficiaryDetails"
import ExpensePaymentMethod from "./components/ExpensePaymentMethod"
import ExpenseAddItemsTable from "./components/ExpenseAddItemsTable"
import ExpenseTax from "./components/ExpenseTax"
import ExpenseSubtotal from "./components/ExpenseSubtotal"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import convertExpenseFormToMutation, { createExpense, getExpensesById, updateExpenses } from "@/lib/expenses/utils"


const ExpenseDetailPage = ({ params }: { params: { expense: string }}) => {
    const session = useSession();
    const router = useRouter();

    const isParamsNew = params?.expense[0] === "new";

    const methods = useForm<ExpensesFormDataType>({
        resolver: zodResolver(expensesFormData),
        defaultValues: ExpensesDefaultValues,
        mode: "onSubmit",
        reValidateMode: "onChange"
    })

    const isStatusActive = methods.getValues("process_as_active")

    async function callRunningNumber() {
        const runningNumber = await getRunningNumber(
          session.data?.user.merchant_id,
          "expense"
        );
    
        if (isParamsNew) {
          methods.setValue("transaction_number", runningNumber);
          return;
        }
    
        return runningNumber;
    }

    async function callGetExpensesById(){
        const expense = await getExpensesById(params.expense)
        methods.reset(expense)
    }

    const onSubmit: SubmitHandler<ExpensesFormDataType> = (data: ExpensesFormDataType) => {
        const expenseBody = {
          ...convertExpenseFormToMutation(data),
          merchant_id: session.data?.user?.merchant_id,
        };

        if (isParamsNew) {
          createExpense(expenseBody, router, false);
        } else {
          updateExpenses(expenseBody, router, false);
        }
      }
    
      const onSubmitWithPay: SubmitHandler<ExpensesFormDataType> = (data: ExpensesFormDataType) => {
        const expenseBody = {
            ...convertExpenseFormToMutation(data),
            merchant_id: session.data?.user?.merchant_id,
          };
    
        if (isParamsNew) {
            createExpense(expenseBody, router, true);
        } else {
            updateExpenses(expenseBody, router, true);
        }
      }
    
      const onSubmitMakeACopy: SubmitHandler<ExpensesFormDataType> = async (data: ExpensesFormDataType) => {
        const newRunningNumber = await callRunningNumber();
        const modData = {
          ...data,
          transaction_number: newRunningNumber ?? "",
          process_as_active: false,
          process_as_paid: false,
        };
        const purchaseBody = {
          ...convertExpenseFormToMutation(modData),
          merchant_id: session.data?.user?.merchant_id,
        };
    
        createExpense(purchaseBody, router, false);
      }
    
    useEffect(() => {
        if (session.data?.user.merchant_id) {
            callRunningNumber();
        }
    }, [session.data?.user]);

    useEffect(() => {
        if(params.expense[0] !== "new"){
            callGetExpensesById();
        }
    }, [params.expense, methods])

    return(
        <>
            <Alert
                className="mb-3"
                variant="destructive"
                style={{
                display: isStatusActive ? "block" : "none",
                }}
            >
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>
                    You cannot edit this expense because it&apos;s not a draft.
                </AlertDescription>
            </Alert>
            <div className="flex items-center gap-4 mb-5">
                <div className="flex items-center gap-4">
                <Button
                    type="reset"
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => router.back()}
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    {isParamsNew
                    ? "New Purchase"
                    : methods.getValues("transaction_number")}
                </h1>
                </div>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <div className="flex flex-col md:flex-row gap-5">
                    {!isStatusActive && (
                    <>
                        <Button onClick={methods.handleSubmit(onSubmit)}>
                            {isParamsNew ? "Create" : "Update"}
                        </Button>
                        <Button onClick={methods.handleSubmit(onSubmitWithPay)}>
                            {isParamsNew ? "Create & Pay" : "Update & Pay"}
                        </Button>
                    </>
                    )}
                    {!isParamsNew && (
                    <Button onClick={methods.handleSubmit(onSubmitMakeACopy)}>
                        Make a Copy
                    </Button>
                    )}
                </div>
                </div>
            </div>

            <FormProvider {...methods}>
                <div className="md:flex gap-4">
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        <ExpenseTransactionDetails />

                        <ExpenseBeneficiaryDetails isUpdate={!isParamsNew} />
                    </div>

                    <div className="w-1/3 hidden md:block">
                        <ExpensePaymentMethod />
                    </div>
                </div>

                <div className="my-6">
                    <ExpenseAddItemsTable />
                </div>

                <div className="md:flex">
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        <ExpenseTax />

                        <ExpenseSubtotal />
                    </div>
                    <div className="flex flex-col gap-4 w-full md:hidden mt-4">
                        <ExpensePaymentMethod />
                    </div>
                </div>
            </FormProvider>
            <div className="items-center gap-2 md:ml-auto flex my-4">
                {!isStatusActive && (
                <>
                    <Button
                    className="md:w-auto w-full"
                    onClick={methods.handleSubmit(onSubmit)}
                    >
                    {isParamsNew ? "Create" : "Update"}
                    </Button>
                    <Button
                    className="md:w-auto w-full"
                    onClick={methods.handleSubmit(onSubmitWithPay)}
                    >
                    {isParamsNew ? "Create & Pay" : "Update & Pay"}
                    </Button>
                </>
                )}
                {!isParamsNew && (
                <Button onClick={methods.handleSubmit(onSubmitMakeACopy)}>
                    Make a Copy
                </Button>
                )}
            </div>
        </>
    )
}

export default ExpenseDetailPage