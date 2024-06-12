import { Contact } from "@/types/contact.d";
import { numberFixedToString } from "../utils";

export async function getContacts(
  merchant_id: String
): Promise<Array<Contact>> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/contacts?merchant_id=${merchant_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const contacts: Array<Contact> = data.data;
      return contacts;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export const getContact = async (contact_id: String): Promise<Contact> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/contacts/${contact_id}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      const contact: Contact = data.data;
      return contact;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
};

export const deleteContact = async (contact_id: String) => {
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/contacts/${contact_id}`, {
    method: "DELETE",
  }).catch((e) => {
    throw new Error("Failed to fetch data", e);
  });
};

export const createContact = async (data: Contact, merchant_id: String) => {
  data.merchant_id = Number(merchant_id);
  let contact: any = data;

  contact.total = numberFixedToString(data.total);
  contact.subtotal = numberFixedToString(data.subtotal);
  contact.tax = numberFixedToString(data.tax);
  contact.discount_value = numberFixedToString(data.discount_value);
  contact.discount_price_cut = numberFixedToString(data.discount_price_cut);
  contact.total = numberFixedToString(data.total);

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contacts`, {
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
};

export const updateContact = async (
  data: Contact,
  merchant_id: String,
  contact_id: String
) => {
  data.merchant_id = Number(merchant_id);
  let contact: any = data;

  contact.total = numberFixedToString(data.total);
  contact.subtotal = numberFixedToString(data.subtotal);
  contact.tax = numberFixedToString(data.tax);
  contact.discount_value = numberFixedToString(data.discount_value);
  contact.discount_price_cut = numberFixedToString(data.discount_price_cut);
  contact.total = numberFixedToString(data.total);

  await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contacts/${contact_id}`, {
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
