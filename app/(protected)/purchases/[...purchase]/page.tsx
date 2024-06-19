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


const PurchasePage = ({ params }: { params: { purchase: string } }) => {
  const methods = useForm<Purchase>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: PurchaseDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  async function onSubmit(data: Purchase) {
    console.log(data);
  }

  console.log('getValues', methods.watch())

  return (
    <>
      <FormProvider {...methods}>
        <div className="flex gap-4">
          <div className="w-2/3 flex flex-col gap-6">
            <PurchaseTransactionDetails/>

            <PurchaseCustomerDetails/>

            <PurchaseAddProductTable/>

            <PurchaseDiscount/>

            <PurchaseSubtotal/>
          </div>

          <div className="flex flex-col w-1/3 gap-4">
            <PurchasePaymentMethod/>
            <PurchaseMemo/>
          </div>
        </div>
      </FormProvider>
    </>
  )
}

export default PurchasePage;
