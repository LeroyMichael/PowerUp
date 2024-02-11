import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function numbering(type: string, data?: string | null): string {
  let map = data ? JSON.parse(data) : null;
  let num = "/001";
  switch (type) {
    case "Invoice":
      "/" +
        (map !== null
          ? String(map["invoice"] ? map["invoice"] + 1 : "1").padStart(3, "0")
          : "001");
      return "INV/" + moment().format("YYYYMMDD") + num;
      break;
    case "Pro Invoice":
      num =
        "/" +
        (map !== null
          ? String(map["proinvoice"] ? map["proinvoice"] + 1 : "1").padStart(
              3,
              "0"
            )
          : "001");
      return "PRO/" + moment().format("YYYYMMDD") + num;
      break;
    case "Penawaran":
      num =
        map !== null
          ? String(map["proposal"] ? map["proposal"] + 1 : "1").padStart(3, "0")
          : "001";
      return (
        num +
        "/CTS/" +
        convertToRoman(Number(moment().format("M"))) +
        moment().format("/YYYY")
      );
      break;

    default:
      return "INV/" + moment().format("YYYYMMDD") + "/001";
      break;
  }
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
  }).format(number);
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
