import { Sale } from "@/types/sale.d";
import { numberFixedToString } from "../utils";
import { redirect } from "next/dist/server/api-utils";
import { redirect as nredirect } from "next/navigation";
import { Contact } from "@/types/contact";
import { useRouter } from "next/router";
import moment from "moment";
import { toast } from "@/components/ui/use-toast";

export async function getSales(
  merchant_id: String,
  page: Number
): Promise<Array<Sale>> {
  const res = await fetch(
    `${
      process.env.NEXT_PUBLIC_URL
    }/api/sales?merchant_id=${merchant_id}&page=${page.toString()}`,
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
    `${process.env.NEXT_PUBLIC_URL}/api/contacts?merchant_id=${merchant_id}&page=1`,
    {
      method: "GET",
    }
  )
    .then((res_detail) => res_detail.json())
    .then((data) => {
      const contact: Array<Contact> = data.data;
      return contact;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  const contact_detail = res_detail.find((contact) => contact.contact_id == 1);
  // res.map((r) => r.cust_detail = res_detail.find(res_detail => res_detail.contact_id === 1))
  const sales_detail = res.map((r: Sale) => {
    const contactDetail = res_detail.find(
      (contact) => contact.contact_id == r.contact_id
    );
    return {
      ...r,
      contact_detail: contactDetail,
    };
  });
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
      sale.transaction_date = moment(
        data.data.transaction_date,
        "DD-MM-YYYY"
      ).toDate();

      sale.due_date = moment(data.data.due_date, "DD-MM-YYYY").toDate();

      sale.discount_value = Number(sale.discount_value);
      sale.discount_price_cut = Number(sale.discount_price_cut);
      sale.tax = Number(sale.tax);
      sale.tax_rate = sale.tax_rate;
      sale.subtotal = Number(sale.subtotal);
      sale.total = Number(sale.total);
      sale.down_payment_amount = Number(sale.down_payment_amount);
      sale.delivery_amount = Number(sale.delivery_amount);
      sale.delivery_method = sale.delivery_method ?? "";
      if (sale.details && Array.isArray(sale.details)) {
        sale.details.forEach((detail) => {
          detail.unit_price = Number(detail.unit_price);
          detail.amount = Number(detail.amount);
        });
      } else {
        console.error("sale.details is undefined or not an array");
      }
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

export const createSale = async (
  data: Sale,
  merchant_id: String,
  router: any,
  isPaid: boolean = false
) => {
  data.merchant_id = Number(merchant_id);
  let sale: any = data;

  sale.total = numberFixedToString(data.total);
  sale.subtotal = numberFixedToString(data.subtotal);
  sale.tax = numberFixedToString(data.tax);
  sale.tax_rate = numberFixedToString(data.tax_rate);
  sale.discount_value = numberFixedToString(data.discount_value);
  sale.discount_price_cut = numberFixedToString(data.discount_price_cut);
  sale.delivery_amount = numberFixedToString(data.delivery_amount);
  sale.total = numberFixedToString(data.total);
  sale.details = sale.details.map((d: Record<string, any>) => {
    d.unit_price = numberFixedToString(d.unit_price);
    d.amount = numberFixedToString(d.amount);
    return d;
  });

  //add leading zero if day/month less than 10
  const lz = (date: number) => (date < 10 ? "0" + date : date);

  const transaction_date_date = lz(sale.transaction_date.getDate());
  const transaction_date_month = lz(sale.transaction_date.getMonth() + 1);
  const transaction_date_year = sale.transaction_date.getFullYear();
  const transaction_date_format = `${transaction_date_date}-${transaction_date_month}-${transaction_date_year}`;
  sale.transaction_date = transaction_date_format;

  const due_date_date = lz(sale.due_date.getDate());
  const due_date_month = lz(sale.due_date.getMonth() + 1);
  const due_date_year = sale.due_date.getFullYear();
  const due_date_format = `${due_date_date}-${due_date_month}-${due_date_year}`;
  sale.due_date = due_date_format;

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });
  if (response === null) return null;
  if (isPaid == true) {
    const new_sale_id = response.data.sale_id;
    await activateSale(new_sale_id).then(async () => {
      await paidSale(new_sale_id);
    });
  }
  toast({
    description: "Your transaction has been submitted.",
  });
  router.push("/sales");
};

export const updateSale = async (
  data: Sale,
  merchant_id: String,
  router: any,
  sale_id: Number,
  isPaid: boolean = false
) => {
  data.merchant_id = Number(merchant_id);
  let sale: any = data;

  sale.total = numberFixedToString(data.total);
  sale.subtotal = numberFixedToString(data.subtotal);
  sale.tax = numberFixedToString(data.tax);
  sale.tax_rate = numberFixedToString(data.tax_rate);
  sale.discount_value = numberFixedToString(data.discount_value);
  sale.discount_price_cut = numberFixedToString(data.discount_price_cut);
  sale.delivery_amount = numberFixedToString(data.delivery_amount);
  sale.total = numberFixedToString(data.total);
  sale.details = sale.details.map((d: Record<string, any>) => {
    d.unit_price = numberFixedToString(d.unit_price);
    d.amount = numberFixedToString(d.amount);
    return d;
  });
  //add leading zero if day/month less than 10
  const lz = (date: number) => (date < 10 ? "0" + date : date);

  const transaction_date_date = lz(sale.transaction_date.getDate());
  const transaction_date_month = lz(sale.transaction_date.getMonth() + 1);
  const transaction_date_year = sale.transaction_date.getFullYear();
  const transaction_date_format = `${transaction_date_date}-${transaction_date_month}-${transaction_date_year}`;
  sale.transaction_date = transaction_date_format;

  const due_date_date = lz(sale.due_date.getDate());
  const due_date_month = lz(sale.due_date.getMonth() + 1);
  const due_date_year = sale.due_date.getFullYear();
  const due_date_format = `${due_date_date}-${due_date_month}-${due_date_year}`;
  sale.due_date = due_date_format;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      redirect: "follow",
    }
  )
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      } else {
        return res.json();
      }
    })
    .catch((err: Error) => {
      toast({
        title: `Error: ${JSON.parse(err.message).message}`,
        description: `${JSON.stringify(JSON.parse(err.message).errors)}`,
      });
      return null;
    });
  if (response === null) return null;
  if (isPaid == true) {
    const new_sale_id = response.data.sale_id;
    await activateSale(new_sale_id).then(async () => {
      await paidSale(new_sale_id);
    });
  }
  toast({
    description: "Your transaction has been updated.",
  });
  router.push("/sales");
};

export const activateSale = async (sale_id: String) => {
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}/activate`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to activate sales", e);
  });
};

export const paidSale = async (sale_id: String) => {
  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/sales/${sale_id}/pay`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    redirect: "follow",
  }).catch((e) => {
    throw new Error("Failed to paid sales", e);
  });
};

export const createAndPaySale = async (
  data: Sale,
  merchant_id: String,
  router: any
) => {
  const sales_id = createSale(data, merchant_id, router);
};
