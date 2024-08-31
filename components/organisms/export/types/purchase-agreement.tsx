import { Text } from "@react-pdf/renderer";
import { ExportInvoiceStyle } from "../styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";

const PurchaseAgreement = (props: { data: ExportInvoiceType }) => {
  return (
    <>
      <Text style={ExportInvoiceStyle.footerTextBold}>PURCHASE AGREEMENT:</Text>
      <Text style={ExportInvoiceStyle.footerText}>
        1. Pembeli diharuskan untuk melakukan pembayaran muka sebesar{" "}
        {props.data.transaction_details?.down_payment_type == "FIX" && "Rp"}
        {props.data.transaction_details?.down_payment_amount}
        {props.data.transaction_details?.down_payment_type == "RATE" &&
          "%"}{" "}
        dari total pembelian.
      </Text>
      <Text style={ExportInvoiceStyle.footerText}>
        2. Pembeli harus menyelesaikan pembayaran sisa tagihan sebelum barang
        dikirimkan.
      </Text>
      <Text style={ExportInvoiceStyle.footerText}>
        3. Waktu pelaksanaan pengerjaan berkisar antara{" "}
        {props.data.transaction_info?.estimated_time}, dengan kemungkinan
        penyelesaian lebih cepat.
      </Text>
      <Text style={ExportInvoiceStyle.footerText}>
        4. Kami mengutamakan kepuasan pelanggan kami sebagai prioritas utama.
      </Text>

      <Text style={{ ...ExportInvoiceStyle.textBold, ...{ marginTop: 5 } }}>
        NOTES:
      </Text>
      <Text style={ExportInvoiceStyle.text}>
        Pembayaran dilakukan Via Transfer BCA: 549-503-9932 A/N ALVINO SETIO
      </Text>
      <Text style={ExportInvoiceStyle.text}>
        {props.data.transaction_info?.memo}
      </Text>
    </>
  );
};

export default PurchaseAgreement;
