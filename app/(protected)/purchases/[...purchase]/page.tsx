"use client";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PurchaseCustomerDetails from "./components/PurchaseCustomerDetails";
import PurchaseSubtotal from "./components/PurchaseSubtotal";
import PurchaseTransactionDetails from "./components/PurchaseTransactionDetails";
import PurchasePaymentMethod from "./components/PurchasePaymentMethod";
import PurchaseAddProductTable from "./components/PurchaseAddProductTable";
import PurchaseMemo from "./components/PurchaseMemo";
import PurchaseDiscountAndTax from "./components/PurchaseDiscountAndTax";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  convertPurchaseMutation,
  createPurchase,
  getPurchaseById,
  updatePurchase,
} from "@/lib/purchase/utils";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRunningNumber } from "@/lib/utils";
import {
  Purchase,
  PurchaseDefaultValues,
  PurchaseSchema,
} from "@/types/purchase.d";

const PurchasePage = ({ params }: { params: { purchase: string } }) => {
  const session = useSession();

  const router = useRouter();

  const isParamsNew = params?.purchase[0] === "new";

  const methods = useForm<Purchase>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: PurchaseDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function callRunningNumber() {
    const runningNumber = await getRunningNumber(
      session.data?.user.merchant_id,
      "purchase"
    );

    if (isParamsNew) {
      methods.setValue("transaction_number", runningNumber);
      return;
    }

    return runningNumber;
  }

  const isStatusActive = methods.getValues("process_as_active");

  const onSubmit: SubmitHandler<Purchase> = (data: Purchase) => {
    const purchaseBody = {
      ...convertPurchaseMutation(data),
      merchant_id: session.data?.user?.merchant_id,
    };

    if (isParamsNew) {
      createPurchase(purchaseBody, router, false);
    } else {
      updatePurchase(purchaseBody, router, false);
    }
  };

  const onSubmitWithPay: SubmitHandler<Purchase> = (data: Purchase) => {
    const purchaseBody = {
      ...convertPurchaseMutation(data),
      merchant_id: session.data?.user?.merchant_id,
    };

    if (isParamsNew) {
      createPurchase(purchaseBody, router, true);
    } else {
      updatePurchase(purchaseBody, router, true);
    }
  };

  const onSubmitMakeACopy: SubmitHandler<Purchase> = async (data: Purchase) => {
    const newRunningNumber = await callRunningNumber();
    const modData = {
      ...data,
      transaction_number: newRunningNumber ?? "",
      process_as_active: false,
      process_as_paid: false,
    };
    const purchaseBody = {
      ...convertPurchaseMutation(modData),
      merchant_id: session.data?.user?.merchant_id,
    };

    createPurchase(purchaseBody, router, false);
  };

  async function getPurchaseByIdData() {
    const temp = await getPurchaseById(params?.purchase);
    methods.reset(temp);
  }

  useEffect(() => {
    if (session.data?.user.merchant_id) {
      callRunningNumber();
    }
  }, [session.data?.user]);

  useEffect(() => {
    if (params.purchase[0] !== "new") {
      getPurchaseByIdData();
    }
  }, [params.purchase, methods]);

  return (
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
          You cannot edit this sales because it&apos;s not a draft.
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
            <PurchaseTransactionDetails />

            <PurchaseCustomerDetails />
          </div>

          <div className="w-1/3 hidden md:block">
            <PurchasePaymentMethod />
            <div className="mt-4">
              <PurchaseMemo />
            </div>
          </div>
        </div>
        <div className="my-6">
          <PurchaseAddProductTable />
        </div>
        <div className="md:flex">
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <PurchaseDiscountAndTax />

            <PurchaseSubtotal />
          </div>
          <div className="flex flex-col gap-4 w-full md:hidden mt-4">
            <PurchasePaymentMethod />
            <PurchaseMemo />
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
  );
};

export default PurchasePage;
