import React from "react";
import { ExportInvoiceStyle } from "./styles";
import { Image, Text, View } from "@react-pdf/renderer";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import { rupiah } from "@/lib/utils";

const ExportInvoiceTransactionDetails = (props: {
  data: ExportInvoiceType;
}) => {
  const data: ExportInvoiceType = props.data;
  return (
    <div
      style={{
        ...ExportInvoiceStyle.headerLayout,
        ...{ marginBottom: 10 },
      }}
    >
      <div style={ExportInvoiceStyle.headerColumnLeft}>
        <Text style={ExportInvoiceStyle.textBold}>BILL TO:</Text>
        <Text style={ExportInvoiceStyle.text}>
          {data.contact?.company_name}/{data.contact?.display_name}
        </Text>
        <Text style={ExportInvoiceStyle.text}>
          {data.contact?.billing_address}
        </Text>
        <Text style={ExportInvoiceStyle.text}>{data.contact?.email}</Text>
      </div>
      <div style={ExportInvoiceStyle.headerColumnRight}>
        <Text style={ExportInvoiceStyle.textBold}>INVOICE #</Text>
        <Text style={ExportInvoiceStyle.textE}>
          {data.transaction_info?.transaction_number}
        </Text>
        <Text style={ExportInvoiceStyle.textBold}>DATE</Text>
        <Text style={ExportInvoiceStyle.textE}>
          {data.transaction_info?.transaction_date.toDateString()}
        </Text>
        <Text style={ExportInvoiceStyle.textBold}>INVOICE DUE DATE</Text>
        <Text style={ExportInvoiceStyle.textE}>
          {data.transaction_info?.due_date.toDateString()}
        </Text>
      </div>
    </div>
  );
};

export default ExportInvoiceTransactionDetails;
