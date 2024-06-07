import { Sale } from "@/types/sale.d";
import { numberFixedToString } from "../utils";
import { redirect } from "next/dist/server/api-utils";
import { redirect as nredirect } from "next/navigation";
 

export async function getSales(merchant_id: String, page: Number): Promise<Array<Sale>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/sales?merchant_id=${merchant_id}&page=${page.toString()}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const sales: Array<Sale> = data.data;
      return sales;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });

  const res_detail = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/contacts`,
    {
      method: "GET",
    }
  )
    .then((res_detail) => res_detail.json())
    .then((data) => {
      const sale: Array<Sale> = data.data;
      return sale;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
    const contact_detail = res_detail.find(contact => contact.contact_id == "1")
    // res.map((r) => r.cust_detail = res_detail.find(res_detail => res_detail.contact_id === 1)) 
    const sales_detail = res.map((r) => {
      const contactDetail = res_detail.find(contact => contact.contact_id == "1")
      return {
        ...r,
        contact_detail: contactDetail,
      };
    });
    console.log("RESSS DATAAA CON = ", contact_detail);
    console.log("RESSS DATAAA SAL = ", sales_detail);
  return sales_detail;
}

export const getSale = async (sale_id: String): Promise<Sale> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const sale: Sale = data.data;
      return sale;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  
 
  return res;
};

export const deleteSale = async (sale_id: String) => {
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}`, {
    method: "DELETE",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const createSale = async (data: Sale, merchant_id: String) => {
  data.merchant_id = merchant_id.toString();
  let sale: any = data;

  sale.total = numberFixedToString(parseInt(data.total));
  sale.subtotal = numberFixedToString(parseFloat(data.subtotal));
  sale.tax = numberFixedToString(parseFloat(data.tax));
  sale.discount_value = numberFixedToString(parseFloat(data.discount_value));
  sale.discount_price_cut = numberFixedToString(parseFloat(data.discount_price_cut));
  sale.total = numberFixedToString( parseInt(data.total));

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });

  nredirect("/sales")
};

export const updateSale = async (
  data: Sale,
  merchant_id: String,
  sale_id: String
) => {
  data.merchant_id = merchant_id.toString();
  let sale: any = data; 

  sale.total = numberFixedToString(parseInt(data.total));
  sale.subtotal = numberFixedToString(parseFloat(data.subtotal));
  sale.tax = numberFixedToString(parseFloat(data.tax));
  sale.discount_value = numberFixedToString(parseFloat(data.discount_value));
  sale.discount_price_cut = numberFixedToString(parseFloat(data.discount_price_cut));
  sale.total = numberFixedToString( parseInt(data.total));

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const activateSale = async (
  sale_id: String
) => {

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}/activate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow"
  }).catch((e) => {
    throw new Error("Failed to activate sales", e);
  });
};

export const paidSale = async (
  sale_id: String
) => {

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}/pay`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow"
  }).catch((e) => {
    throw new Error("Failed to paid sales", e);
  });
};