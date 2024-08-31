import { Text } from "@react-pdf/renderer";
import { ExportInvoiceStyle } from "../styles";
import { ExportInvoiceType } from "@/types/export-invoice.d";

export const OfferDetails = (props: { data: ExportInvoiceType }) => {
  return (
    <div style={{ ...{ marginBottom: 10 } }}>
      <div style={{ ...{ marginBottom: 10 } }}>
        <Text style={ExportInvoiceStyle.text}>
          No. {props.data.transaction_info?.transaction_number}
        </Text>
        <Text style={ExportInvoiceStyle.text}>
          Perihal : Surat Penawaran Harga (SPH)
        </Text>
        <Text style={ExportInvoiceStyle.text}>Lampiran : 1 rangkap</Text>
      </div>
      <div style={{ ...{ marginBottom: 10 } }}>
        <Text style={ExportInvoiceStyle.textBold}>Kepada Yth.</Text>
        <Text style={ExportInvoiceStyle.text}>
          Bpk/Ibu {props.data.contact?.display_name}
        </Text>
        <Text style={ExportInvoiceStyle.text}>
          {props.data.contact?.company_name}
        </Text>
        <Text style={ExportInvoiceStyle.text}>
          {props.data.contact?.billing_address}
        </Text>
      </div>
      <Text style={ExportInvoiceStyle.text}>Salam hormat,</Text>
      <Text style={ExportInvoiceStyle.text}>
        Bersama dengan surat ini, kami mengajukan penawaran barang ke perusahaan
        yang Bapak/Ibu kelola. Kami ingin mengirim daftar barang yang kami
        tawarkan meliputi:
      </Text>
    </div>
  );
};

export const OfferFooter = (props: { data: ExportInvoiceType }) => {
  return (
    <>
      <Text style={ExportInvoiceStyle.text}>
        Dalam perjanjian ini, pembeli diwajibkan untuk melakukan pembayaran muka
        sebesar{" "}
        {props.data.transaction_details?.down_payment_type == "FIX"
          ? "Rp" + props.data.transaction_details?.down_payment_amount + " "
          : props.data.transaction_details?.down_payment_amount + "%"}
        dari total pembelian sebagai tanda jadi. Pembeli juga harus melunasi
        sisa tagihan sebelum barang dikirimkan kepadanya. Pengerjaan pesanan
        diperkirakan memakan waktu antara{" "}
        {props.data.transaction_info.estimated_time}, namun kami akan berupaya
        untuk menyelesaikannya lebih cepat jika memungkinkan. Kami ingin
        menekankan bahwa kepuasan pelanggan adalah prioritas utama bagi kami,
        dan kami akan berusaha semaksimal mungkin untuk memenuhi kebutuhan dan
        keinginan pelanggan kami.
      </Text>
      <Text style={ExportInvoiceStyle.text}>
        Demikian surat penawaran ini kami sampaikan. Apabila Bapak/Ibu berkenan
        dengan penawaran kami, silakan menghubungi kami dan kami akan dengan
        senang hati melayani. Atas perhatian dan kerja samanya kami ucapkan
        terima kasih.
      </Text>
    </>
  );
};
