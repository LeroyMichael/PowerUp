import React from "react";
import { ExportInvoiceStyle } from "./styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import PurchaseAgreement from "./types/purchase-agreement";
import { OfferFooter } from "./types/offer";
import Sign from "./types/sign";

const ExportInvoiceFooter = (props: { data: ExportInvoiceType }) => {
  return (
    <div style={{ marginTop: "10px" }}>
      <div style={ExportInvoiceStyle.footerLayout}>
        {props.data.transaction_info?.transaction_type == "Penawaran" ? (
          <div style={ExportInvoiceStyle.footerColumnLeft}>
            <OfferFooter data={props.data} />
          </div>
        ) : (
          <>
            <div style={ExportInvoiceStyle.footerColumnLeft}>
              {props.data.transaction_info?.is_purchase_agreement && (
                <PurchaseAgreement data={props.data} />
              )}
            </div>

            <div style={ExportInvoiceStyle.footerColumnRight}>
              <Sign data={props.data} />
            </div>
          </>
        )}
      </div>

      {props.data.transaction_info?.transaction_type == "Penawaran" && (
        <div>
          <div style={ExportInvoiceStyle.footerLayout}>
            <div style={ExportInvoiceStyle.footerColumnLeft}></div>
            <div style={ExportInvoiceStyle.footerColumnRight}>
              <Sign data={props.data} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportInvoiceFooter;
