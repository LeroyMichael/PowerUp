import { Product } from "@/types/product";
import { Purchase, PurchaseDetailMutation, PurchaseMutation } from "@/types/purchase";
import { format, parse } from "date-fns";
import { numberFixedToString } from "../utils";

export type TProductLists = {
    product_id: number,
    product_name: string,
    unit_price: number,
}

export function mappingProductLists(rawProductLists: Product[]): TProductLists[]{
    
    const newProductList: TProductLists[] = rawProductLists.map((product) => {
        return {
            product_id: product.product_id,
            product_name: product.name,
            unit_price: Number(product.sell.sell_price),
        }
    })

    return newProductList
}

export function convertPurchaseMutation(purchaseData: Purchase): PurchaseMutation{
    return {
        ...purchaseData,
        transaction_date: format(purchaseData.transaction_date, "dd-MM-yyyy"),
        due_date: format(purchaseData.due_date, "dd-MM-yyyy"),
        subtotal: numberFixedToString(purchaseData.subtotal),
        tax: numberFixedToString(purchaseData.tax),
        tax_rate: purchaseData.tax_rate.toString(),
        discount_value: purchaseData.discount_value,
        discount_price_cut: numberFixedToString(purchaseData.discount_price_cut),
        total: numberFixedToString(purchaseData.total),
        details: purchaseData.details.map((detail) => {
            return {
                ...detail,
                unit_price: numberFixedToString(detail.unit_price),
                amount: numberFixedToString(detail.amount)
            }
        })
    }
}

export async function getPurchasesLists(merchant_id: number, search?: string){

  const searchParams = search && `&search=${search}`

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/purchases?merchant_id=${merchant_id}${searchParams}`,
    {
        method: "GET"
    }).then((res) => res.json())
    .catch((e) => {
        throw new Error("Failed to fetch purchase lists", e)
    })

    return res.data
}

export const getPurchaseById = async (purchase_id: String): Promise<Purchase> => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}`,
      {
        method: "GET",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const purchase: any = convertPurchaseDataToFormData(data.data);

        return purchase;
      })
      .catch((e) => {
        throw new Error("Failed to fetch data", e);
      });
    return res;
  };

export async function activatePurchase(purchase_id: number){
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}/activate`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        redirect: "follow"
    }).catch((e) => {
        throw new Error("Failed to activate purchase", e);
    });
}

export async function payPurchase(purchase_id: number){
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}/pay`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-type": "application/json",
        },
        redirect: "follow"
    }).catch((e) => {
        throw new Error("Failed to pay purchase", e);
    });
}

export async function deletePurchase(purchase_id: number){
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases/${purchase_id}`, {
        method: "DELETE",
        redirect: "follow"
    }).catch((e) => {
        throw new Error("Failed to delete purchase", e);
    });
}

export async function createPurchase(body: PurchaseMutation, withPay?: boolean){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        redirect: "follow"
    }).catch((e) => {
        throw new Error("Failed to create purchase", e)
    })

    const responseCreate = await res.json();
    if(responseCreate.data.purchase_id && withPay){
        await activatePurchase(responseCreate.data.purchase_id)
        await payPurchase(responseCreate.data.purchase_id)
    }

    return responseCreate
}

export async function updatePurchase(body: PurchaseMutation, withPay?: boolean){
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/purchases/${body.purchase_id}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
        redirect: "follow"
    }).catch((e) => {
        throw new Error("Failed to create purchase", e)
    })

    const responseCreate = await res.json();
    if(responseCreate.data.purchase_id && withPay){
        await activatePurchase(responseCreate.data.purchase_id)
        await payPurchase(responseCreate.data.purchase_id)
    }

    return responseCreate
}


export async function convertPurchaseDataToFormData(data: PurchaseMutation): Promise<Purchase>{

    const dateFormat = "dd-MM-yyyy"
    return {
        purchase_id: data.purchase_id,
        merchant_id: data.merchant_id,
        wallet_id: data.wallet_id,
        contact_id: data.contact_id,
        currency_code: data.currency_code,
        discount_type: data.discount_type,
        discount_value: data.discount_value,
        discount_price_cut: Number(data.discount_price_cut),
        transaction_number: data.transaction_number,
        billing_address: data.billing_address,
        transaction_date: parse(data.transaction_date, dateFormat, new Date()),
        due_date: parse(data.due_date, dateFormat, new Date()),
        memo: data.memo,
        subtotal: Number(data.subtotal),
        total: Number(data.total),
        payment_method: data.payment_method,
        process_as_active: data.status === "ACTIVE",
        process_as_paid: data.payment_status === "PAID",
        tax: Number(data.tax),
        tax_rate: Number(data.tax_rate),
        details: data.details.map((detail: PurchaseDetailMutation) => {
            return{
                product_id: detail.product_id,
                unit_price: Number(detail.unit_price),
                currency_code: detail.currency_code,
                qty: detail.qty,
                amount: Number(detail.amount),
                description: detail.description
            }
        })
        
    }
}