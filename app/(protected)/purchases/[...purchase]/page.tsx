"use client";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Purchase,
  PurchaseDefaultValues,
  PurchaseSchema,
} from "@/types/purchase.d";
import PurchaseCustomerDetails from "./components/PurchaseCustomerDetails";
import PurchaseSubtotal from "./components/PurchaseSubtotal";
import PurchaseTransactionDetails from "./components/PurchaseTransactionDetails";
import PurchasePaymentMethod from "./components/PurchasePaymentMethod";
import PurchaseAddProductTable from "./components/PurchaseAddProductTable";
import PurchaseMemo from "./components/PurchaseMemo";
import PurchaseDiscount from "./components/PurchaseDiscount";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const PurchasePage = ({ params }: { params: { purchase: string } }) => {
  const router = useRouter();
  const methods = useForm<Purchase>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: PurchaseDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  async function onSubmit(data: Purchase) {
    console.log(data);
  }

  console.log("getValues", methods.watch());

  return (
    <>
      <FormProvider {...methods}>
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
              {params?.purchase == "new"
                ? "New Sale"
                : methods.getValues("transaction_number")}
            </h1>
          </div>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <div className="flex flex-col md:flex-row gap-5">
              <Button>{params?.purchase == "new" ? "Create" : "Update"}</Button>
            </div>
          </div>
        </div>
        <div className="md:flex gap-4">
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            <PurchaseTransactionDetails />

            <PurchaseCustomerDetails />

            <PurchaseAddProductTable />

            <PurchaseDiscount />

            <PurchaseSubtotal />
          </div>

          <div className="flex flex-col w-full md:w-1/3 gap-4 mt-4 md:mt-0">
            <PurchasePaymentMethod />
            <PurchaseMemo />
          </div>
        </div>
        <div className="items-center gap-2 md:ml-auto flex my-4">
          <Button className="md:w-auto w-full">
            {params?.purchase == "new" ? "Create" : "Update"}
          </Button>
        </div>
      </FormProvider>
    </>
  );
};

export default PurchasePage;
