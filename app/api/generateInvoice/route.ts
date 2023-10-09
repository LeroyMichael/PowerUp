import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";
import * as Excel from "exceljs";

export const POST = async () => {
  // XLSX.set_fs(fs);
  const dirRelativeToPublicFolder = "Invoice.xlsx";

  const dir = path.resolve("./public", dirRelativeToPublicFolder);
  // console.log("filename", dir);
  // const file = fs.readFileSync(dir);
  // const workbook = XLSX.read(file);

  // let SheetName = workbook.SheetNames[0]; //get first sheet in file
  // console.log(SheetName);
  // console.log(workbook.Sheets[SheetName]["B9"].v); // outputs : Old Value

  // let newWorkBook = workbook; // create new workbook
  // XLSX.utils.sheet_add_aoa(newWorkBook.Sheets[SheetName], [["Talimas"]], {
  //   origin: "B10",
  // });
  // console.log("b10", newWorkBook.Sheets[SheetName]["B10"].v); // outputs : Old Value

  // XLSX.writeFile(newWorkBook, "public/Invoice2.xlsx");

  const workbook = new Excel.Workbook();
  await workbook.xlsx
    .readFile(dir)
    .then(() => {
      const ws = workbook.getWorksheet("Invoice Non Tax ");
      const b1_font = ws.getCell("B9").font;
      console.log(b1_font);
      return workbook.xlsx.writeFile("public/Invoice3.xlsx");
    })
    .catch((err) => {
      console.log(err.message);
    });

  return NextResponse.json("");
};
