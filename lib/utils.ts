import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Contact, ContactTypeEnum } from "@/types/contact.d";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numberFixedToString(value: number | undefined) {
  return Number(value).toFixed(2).toString();
}

export function numberToPriceFormat(value: number | undefined) {
  return value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
}

export async function getRunningNumber(
  merchant_id: String,
  type: String
): Promise<string> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/running-number?merchant_id=${merchant_id}&type=${type}`,
    {
      method: "GET",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      return data.data.running_number;
    })
    .catch((e) => {
      throw new Error("Failed to fetch data", e);
    });
  return res;
}

export async function numbering(
  type: String,
  merchant_id?: String
): Promise<string> {
  const runningNumber: String = merchant_id
    ? await getRunningNumber(merchant_id, "transaction")
    : "";
  if (runningNumber == "") return "";
  let inv = runningNumber.split("/");
  switch (type) {
    case "Invoice":
      inv[0] = "INV";
      break;
    case "Pro Invoice":
      inv[0] = "PRO";
      break;
    case "Penawaran":
      inv[0] = "PEN";
      break;
    case "Sales":
      inv[0] = "SAL";
      break;

    default:
      break;
  }
  return inv.join("/");
}

export function convertToRoman(num: number): string {
  let res: string = "";
  const value: number[] = [
    1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1,
  ];
  const numerals: string[] = [
    "M",
    "CM",
    "D",
    "CD",
    "C",
    "XC",
    "L",
    "XL",
    "X",
    "IX",
    "V",
    "IV",
    "I",
  ];
  for (let i = 0; num; i++)
    while (num >= value[i]) {
      res += numerals[i];
      num -= value[i];
    }
  return res;
}

export const rupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  })
    .format(number)
    .replace(/\s+/g, "");
};

export function addDays(date: Date, days: number): Date {
  date.setDate(date.getDate() + days);
  return date;
}

export function terbilang(x: number): string {
  var ambil = new Array(
    "",
    "SATU",
    "DUA",
    "TIGA",
    "EMPAT",
    "LIMA",
    "ENAM",
    "TUJUH",
    "DELAPAN",
    "SEMBILAN",
    "SEPULUH",
    "SEBELAS"
  );
  if (x < 12) {
    x = Math.floor(x);
    return " " + ambil[x];
  } else if (x < 20) {
    return terbilang(x - 10) + " BELAS";
  } else if (x < 100) {
    return terbilang(x / 10) + " PULUH" + terbilang(x % 10);
  } else if (x < 200) {
    return " SERATUS" + terbilang(x - 100);
  } else if (x < 1000) {
    return terbilang(x / 100) + " RATUS" + terbilang(x % 100);
  } else if (x < 2000) {
    return " SERIBU" + terbilang(x - 1000);
  } else if (x < 1000000) {
    return terbilang(x / 1000) + " RIBU" + terbilang(x % 1000);
  } else if (x < 1000000000) {
    return terbilang(x / 1000000) + " JUTA" + terbilang(x % 1000000);
  } else if (x < 1000000000000) {
    return terbilang(x / 1000000000) + " MILLIAR" + terbilang(x % 1000000000);
  } else {
    return "";
  }
}

export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export const stringToDate = (datestr: string): Date => {
  // dd-mm-yyyy
  let temp: number[] = datestr.split("-").map(Number);
  let res: Date = new Date(Date.UTC(temp[2], temp[1] - 1, temp[0]));
  return res;
};

export const autoFill = (raw: string): Contact => {
  let contact: Contact = {
    contact_id: 0,
    // Contact Info
    merchant_id: 0,
    contact_type: ContactTypeEnum.customer,
    last_name: "",
    email: "",
    phone_number: "",
    display_name: "",
    first_name: "",
    company_name: "",
    billing_address: "",
    delivery_address: "",
    bank_name: "",
    bank_holder: "",
    bank_number: "",
    memo: "",
  };
  raw.split("\n").forEach(function (value) {
    const [key, val] = value.split(":");
    switch (key) {
      case "Nama": {
        contact.first_name = val.trim();
        break;
      }
      case "Nama PT": {
        contact.company_name = val.trim();
        break;
      }
      case "Alamat pengiriman": {
        contact.delivery_address = val.trim();
        break;
      }
      case "Email": {
        contact.email = val.trim();
        break;
      }
      case "No HP": {
        contact.phone_number = val.trim();
        break;
      }
      case "No Hape": {
        contact.phone_number = val.trim();
        break;
      }
      default: {
        break;
      }
    }
  });
  return contact;
};
