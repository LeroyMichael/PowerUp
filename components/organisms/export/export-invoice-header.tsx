import React from "react";
import { ExportInvoiceStyle } from "./styles";
import { Image, Text, View } from "@react-pdf/renderer";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import { rupiah } from "@/lib/utils";

const ExportInvoiceHeader = (props: { data: ExportInvoiceType }) => {
  return (
    <div style={ExportInvoiceStyle.headerLayout}>
      <div style={ExportInvoiceStyle.headerColumnLeft}>
        <Text style={ExportInvoiceStyle.header}>
          {props.data.transaction_info?.transaction_type}
        </Text>
      </div>
      <div style={ExportInvoiceStyle.headerColumnRight}>
        <div style={ExportInvoiceStyle.headerLayout}>
          <div style={ExportInvoiceStyle.subHeaderColumnRight}>
            <Text style={ExportInvoiceStyle.textBold}>
              {props.data.merchant?.name}
            </Text>
            <Text style={ExportInvoiceStyle.p}>
              Jl. Kariawan 4 no 1, Karang Tengah
            </Text>
            <Text style={ExportInvoiceStyle.p}>Ciledug, Tangerang, 15157</Text>
          </div>
          <div
            style={{
              ...ExportInvoiceStyle.subHeaderColumnLeft,
            }}
          >
            <Image
              style={{ ...ExportInvoiceStyle.image }}
              src={`/logo/${props.data.merchant?.merchant_id ?? 7}.png`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportInvoiceHeader;
