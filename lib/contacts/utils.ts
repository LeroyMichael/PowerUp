import { toast } from "@/components/ui/use-toast";
import { Contact } from "@/types/contact.d";

export async function getContacts(
  merchant_id: String,
  currentPage: Number,
  search?: string,
  contactType?: string
): Promise<Record<string, any>> {
  const searchParams = search ? `&search=${search}` : "";
  const contactTypeParams = contactType ? `&contact_type=${contactType}` : "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/contacts?merchant_id=${merchant_id}&page=${currentPage}${searchParams}${contactTypeParams}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const contacts: Record<string, any> = data;
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

export const deleteContact = async (contact_id: Number) => {
  fetch(`${process.env.NEXT_PUBLIC_URL}/api/contacts/${contact_id}`, {
    method: "DELETE",
  }).catch((e) => {
    toast({
      title: "There was a problem with your request:",
      variant: "destructive",
      description: `${e}`,
    });
    throw new Error("Failed to fetch data", e);
  });
  toast({
    description: "Your transaction has been deleted.",
  });
};

export const createContact = async (
  data: Contact,
  merchant_id: String,
  router: any
) => {
  data.merchant_id = Number(merchant_id);
  let contact: any = data;

  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/contacts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contact),
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
  toast({
    description: "Your contact has been submitted.",
  });
  router.push("/contacts");
};

export const updateContact = async (
  data: Contact,
  merchant_id: String,
  contact_id: String,
  router: any
) => {
  data.merchant_id = Number(merchant_id);
  let contact: any = data;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/contacts/${contact_id}`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
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
  toast({
    description: "Your contact has been updated.",
  });
  router.push("/contacts");
};
