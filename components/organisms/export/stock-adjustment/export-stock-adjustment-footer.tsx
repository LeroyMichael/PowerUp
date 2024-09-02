import React from "react";
import { ExportInvoiceStyle } from "../styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";
import { Image, Text } from "@react-pdf/renderer";
import { StockAdjustment } from "@/types/stock-adjustment";

const ExportStockAdjustmentFooter = (props: { data: StockAdjustment }) => {
  return (
    <div style={{ marginTop: "30px" }}>
      <div>
        <div style={ExportInvoiceStyle.footerLayout}>
          <div
            style={{
              ...ExportInvoiceStyle.footerColumnLeftSA,
              marginLeft: "10px",
              marginRight: "10px",
            }}
          >
            <div>
              <Text style={ExportInvoiceStyle.text}>Yang mengajukan,</Text>
              <div>
                <Image style={ExportInvoiceStyle.imageNoTTD} src={`/ttd.png`} />
              </div>
              <Text style={ExportInvoiceStyle.text}></Text>
              <Text style={ExportInvoiceStyle.text}>(___________________)</Text>
            </div>
            <div>
              <Text style={ExportInvoiceStyle.text}>Mengetahui,</Text>
              <div>
                <Image style={ExportInvoiceStyle.imageNoTTD} src={`/ttd.png`} />
              </div>

              <Text style={ExportInvoiceStyle.text}></Text>
              <Text style={ExportInvoiceStyle.text}>(___________________)</Text>
            </div>

            <div>
              <Text style={ExportInvoiceStyle.text}>Menyetujui,</Text>
              <div>
                <Image style={ExportInvoiceStyle.imageNoTTD} src={`/ttd.png`} />
              </div>

              <Text style={ExportInvoiceStyle.text}></Text>
              <Text style={ExportInvoiceStyle.text}>(___________________)</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportStockAdjustmentFooter;
