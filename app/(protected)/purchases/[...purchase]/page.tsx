"use client";
import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
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
import PurchaseDiscountAndTax from "./components/PurchaseDiscountAndTax";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { convertPurchaseMutation, createPurchase, getPurchaseById, updatePurchase } from "@/lib/purchase/utils";
import { useEffect } from "react";

const PurchasePage = ({ params }: { params: { purchase: string } }) => {

  const session = useSession()

  const router = useRouter()

  const isParamsNew = params?.purchase[0] === "new"

  const methods = useForm<Purchase>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: PurchaseDefaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });


  const onSubmit: SubmitHandler<Purchase> = (data: Purchase) => {
    const purchaseBody = {...convertPurchaseMutation(data), merchant_id: session.data?.user?.merchant_id}
    
    if(isParamsNew){
      createPurchase(purchaseBody).then(() => {
        router.push("/purchases")
      })
    }else{
      updatePurchase(purchaseBody).then(() => {
        router.push('/purchases')
      })
    }
  }

  const onSubmitWithPay: SubmitHandler<Purchase> = (data: Purchase) => {
    const purchaseBody = {...convertPurchaseMutation(data), merchant_id: session.data?.user?.merchant_id}
    
    if(isParamsNew){
      createPurchase(purchaseBody, true).then(() => {
        router.push("/purchases")
      })
    }else{
      updatePurchase(purchaseBody, true).then(() => {
        router.push("/purchases")
      })
    }
  }

  async function getPurchaseByIdData(){
    const temp = await getPurchaseById(params?.purchase);
    methods.reset(temp);
  }
 
  useEffect(() => {
    if(params.purchase[0] !== "new"){
      getPurchaseByIdData()
    }
  }, [params.purchase, methods]);

  return (
    <>
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
              <div className="flex flex-col md:flex-row gap-5" >
                <Button onClick={methods.handleSubmit(onSubmit)}>{isParamsNew? "Create" : "Update"}</Button>
                <Button onClick={methods.handleSubmit(onSubmitWithPay)}>{isParamsNew? "Create & Pay" : "Update & Pay"}</Button>
              </div>
            </div>
          </div>
      <FormProvider {...methods}>
          <div className="md:flex gap-4">
            <div className="w-full md:w-2/3 flex flex-col gap-6">
              <PurchaseTransactionDetails />

              <PurchaseCustomerDetails />

              <PurchaseAddProductTable />

              <PurchaseDiscountAndTax />

              <PurchaseSubtotal />
            </div>

            <div className="flex flex-col w-full md:w-1/3 gap-4 mt-4 md:mt-0">
              <PurchasePaymentMethod />
              <PurchaseMemo />
            </div>
          </div>
      </FormProvider>

          <div className="items-center gap-2 md:ml-auto flex my-4">
            <Button className="md:w-auto w-full" onClick={methods.handleSubmit(onSubmit)}>
              {isParamsNew ? "Create" : "Update"}
            </Button>
            <Button onClick={methods.handleSubmit(onSubmitWithPay)}>
              {isParamsNew? "Create & Pay" : "Update & Pay"}
            </Button>
          </div>
    </>
  );
};

export default PurchasePage;
