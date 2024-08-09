import React from "react";
import { ExportInvoiceStyle } from "./styles";
import { Image, Text, View } from "@react-pdf/renderer";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import { rupiah } from "@/lib/utils";

const ExportInvoiceFooter = (props: { data: ExportInvoiceType }) => {
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={ExportInvoiceStyle.footerLayout}>
        <div style={ExportInvoiceStyle.footerColumnLeft}></div>

        <div style={ExportInvoiceStyle.footerColumnRight}>
          <Text style={ExportInvoiceStyle.text}>Hormat kami,</Text>
          {props.data.transaction_info?.is_presigned ? (
            <Image
              style={ExportInvoiceStyle.imageTTD}
              src={`/sign/${props.data.merchant?.merchant_id}.png`}
            />
          ) : (
            <Image
              style={ExportInvoiceStyle.imageNoTTD}
              src={`/sign/${props.data.merchant?.merchant_id}.png`}
            />
          )}

          <Text style={ExportInvoiceStyle.text}>
            {props.data.merchant?.admin_name}
          </Text>
          <Text style={ExportInvoiceStyle.text}>Direktur Utama</Text>
        </div>
      </div>
    </div>
  );
};

export default ExportInvoiceFooter;
