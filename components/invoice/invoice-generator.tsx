/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { NumericFormat } from "react-number-format";
import {
  Page,
  Text,
  Image,
  Document,
  StyleSheet,
  Canvas,
  View,
  Font,
} from "@react-pdf/renderer";
import customStyles from "./InvoiceGenerator.module.css";
import moment from "moment";
import { rupiah, terbilang } from "@/lib/utils";
import Penawaran from "./types/penawaran";
import ProInvoice from "./types/pro-invoice";
import Invoice from "./types/invoice";
import { ProfileFormValues } from "@/types/transaction-schema";
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "/fonts/Inter-Regular.ttf",
      fontWeight: 400,
    },
    {
      src: "/fonts/Inter.ttf",
      fontWeight: 700,
    },
  ],
});
export const styles = StyleSheet.create({
  body: {
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 24,
    textAlign: "center",
  },
  text: {
    fontFamily: "Inter",
    fontSize: 8,
    textAlign: "justify",
    marginBottom: 2,
  },
  totalPrice: {
    marginTop: 10,
    fontFamily: "Inter",
    fontSize: 20,
    textAlign: "right",
    fontWeight: 700,
    marginBottom: 1,
  },
  textE: {
    fontFamily: "Inter",
    fontSize: 8,
    textAlign: "justify",
    marginBottom: 5,
  },
  p: {
    fontFamily: "Inter",
    fontSize: 8,
    textAlign: "justify",
  },
  image: {
    width: "40px",
  },
  imageTTD: {
    width: "50px",
    height: "50px",
  },
  imageNoTTD: {
    width: "0px",
    height: "50px",
  },
  header: {
    fontSize: 30,
    textAlign: "center",
  },
  textBold: {
    fontFamily: "Inter",
    fontSize: 9,
    textAlign: "justify",
    fontWeight: 700,
    marginBottom: 2,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 10,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  headerLine: {
    width: "100%",
    height: 10,
    backgroundColor: "black",
  },
  headerLayout: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  headerColumnLeft: {
    flex: 1,
    display: "flex",
    alignItems: "flex-start",
  },
  headerColumnRight: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  subHeaderColumnLeft: {
    marginLeft: 10,
  },
  subHeaderColumnRight: {
    marginLeft: "0px",
    flex: 2,
    display: "flex",
    alignItems: "flex-end",
  },
  separator: {
    width: "100%",
    height: "1px",
    backgroundColor: "black",
    marginBottom: 10,
  },
  main: {
    padding: 20,
  },
  tableRowHeader: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: "black",
    color: "white",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "55%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableColQty: {
    width: "5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColPrice: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColFoot: {
    width: "55%",
  },
  tableColQtyFoot: {
    width: "5%",
  },
  tableColPriceFoot: {
    width: "20%",
  },
  tableColPriceFootHighlight: {
    width: "20%",
    backgroundColor: "#FFFF00",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
  },
  tableCellCenter: {
    margin: 5,
    fontSize: 8,
  },

  footerTextBold: {
    fontFamily: "Inter",
    fontSize: 7,
    textAlign: "justify",
    fontWeight: 700,
    marginBottom: 2,
  },
  footerText: {
    fontFamily: "Inter",
    fontSize: 6,
    textAlign: "justify",
    marginBottom: 2,
  },
  footerLayout: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
  },
  footerColumnLeft: {
    flex: 2,
    display: "flex",
    alignItems: "flex-start",
  },
  footerColumnRight: {
    flex: 1,
    display: "flex",
    alignItems: "flex-end",
    marginRight: "25px",
  },
});

const InvoiceGenerator = (props: { data: ProfileFormValues }) => {
  const totalAfterDiscount =
    (props.data.subtotal ?? 0) - (props.data.discount ?? 0);
  const totalTax = (totalAfterDiscount * (props.data.tax ?? 0)) / 100;
  const total = totalAfterDiscount + totalTax;
  const totalDP = (total * (props.data.dp ?? 0)) / 100;
  let grandTotal = total + (props.data.delivery ?? 0);
  if (totalDP != 0) {
    if (props.data.type != "Penawaran") {
      grandTotal = totalDP + (props.data.delivery ?? 0);
    }
  }

  return (
    <Document>
      <Page size="A4" style={{ ...styles.body }}>
        <div style={styles.headerLine}></div>
        <div style={styles.main}>
          <div style={styles.headerLayout}>
            <div style={styles.headerColumnLeft}>
              <Text style={styles.header}>
                {props.data.type == "Penawaran"
                  ? "Surat Penawaran"
                  : props.data.type == "Pro Invoice"
                  ? "Proforma Invoice"
                  : props.data.type}
              </Text>
            </div>
            <div style={styles.headerColumnRight}>
              <div style={styles.headerLayout}>
                <div style={styles.subHeaderColumnRight}>
                  <Text style={styles.textBold}>Colossus Teknik Steel</Text>
                  <Text style={styles.p}>
                    Jl. Kariawan 4 no 1, Karang Tengah
                  </Text>
                  <Text style={styles.p}>Ciledug, Tangerang, 15157</Text>
                </div>
                <div
                  style={{
                    ...styles.subHeaderColumnLeft,
                  }}
                >
                  <Image style={{ ...styles.image }} src="/logo.png" />
                </div>
              </div>
            </div>
          </div>
          <div style={styles.separator}></div>
          {props.data.type == "Penawaran" ? (
            <Penawaran data={props.data} />
          ) : (
            <div style={{ ...styles.headerLayout, ...{ marginBottom: 10 } }}>
              <div style={styles.headerColumnLeft}>
                <Text style={styles.textBold}>BILL TO:</Text>
                <Text style={styles.text}>
                  {props.data.company}/{props.data.name}
                </Text>
                <Text style={styles.text}>{props.data.address}</Text>
                <Text style={styles.text}>{props.data.email}</Text>
              </div>
              <div style={styles.headerColumnRight}>
                <Text style={styles.textBold}>INVOICE #</Text>
                <Text style={styles.textE}>{props.data.invoiceNumber}</Text>
                <Text style={styles.textBold}>DATE</Text>
                <Text style={styles.textE}>{props.data.invoiceDate}</Text>
                <Text style={styles.textBold}>INVOICE DUE DATE</Text>
                <Text style={styles.textE}>{props.data.invoiceDueDate}</Text>
              </div>
            </div>
          )}
          <div>
            <View>
              <View style={styles.tableRowHeader}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>
                    NAMA BARANG DAN DESKRIPSI
                  </Text>
                </View>
                <View style={styles.tableColQty}>
                  <Text style={styles.tableCell}>QTY</Text>
                </View>
                <View style={styles.tableColPrice}>
                  <Text style={styles.tableCell}>HARGA SATUAN</Text>
                </View>
                <View style={styles.tableColPrice}>
                  <Text style={styles.tableCell}>TOTAL HARGA</Text>
                </View>
              </View>
              {/* Iterator */}

              {props.data.invoices?.map((data: any, id: any) => {
                return (
                  <View key={id} style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCellCenter}>{data.desc}</Text>
                    </View>
                    <View style={styles.tableColQty}>
                      <Text style={styles.tableCell}>{data.quantity}</Text>
                    </View>
                    <View style={styles.tableColPrice}>
                      <Text style={styles.tableCell}>{rupiah(data.price)}</Text>
                    </View>
                    <View style={styles.tableColPrice}>
                      <Text style={styles.tableCell}>
                        {rupiah(data.quantity * data.price)}
                      </Text>
                    </View>
                  </View>
                );
              })}
              <ProInvoice
                data={props.data}
                totalDP={totalDP}
                totalTax={totalTax}
              />
              {/* {props.data.type == "Invoice" ||
              props.data.type == "Penawaran" ? (
                <Invoice data={props.data} totalTax={totalTax} />
              ) : (
                <></>
              )}
              {props.data.type == "Pro Invoice" ? (
                <ProInvoice
                  data={props.data}
                  totalDP={totalDP}
                  totalTax={totalTax}
                />
              ) : (
                <></>
              )} */}
            </View>
          </div>
          {/* Total */}
          <div>
            <Text style={styles.totalPrice}>{rupiah(grandTotal)}</Text>
            <Text
              style={{
                ...styles.textBold,
                ...{ textAlign: "right", marginBottom: 10 },
              }}
            >
              {terbilang(total) + " RUPIAH"}
            </Text>
          </div>

          {props.data.type == "Penawaran" ? (
            <>
              <Text style={styles.text}>
                Dalam perjanjian ini, pembeli diwajibkan untuk melakukan
                pembayaran muka sebesar {props.data.dp}% dari total pembelian
                sebagai tanda jadi. Pembeli juga harus melunasi sisa tagihan
                sebelum barang dikirimkan kepadanya. Pengerjaan pesanan
                diperkirakan memakan waktu antara {props.data.estimatedTime},
                namun kami akan berupaya untuk menyelesaikannya lebih cepat jika
                memungkinkan. Kami ingin menekankan bahwa kepuasan pelanggan
                adalah prioritas utama bagi kami, dan kami akan berusaha
                semaksimal mungkin untuk memenuhi kebutuhan dan keinginan
                pelanggan kami.
              </Text>
              <Text style={styles.text}>
                Demikian surat penawaran ini kami sampaikan. Apabila Bapak/Ibu
                berkenan dengan penawaran kami, silakan menghubungi kami dan
                kami akan dengan senang hati melayani. Atas perhatian dan kerja
                samanya kami ucapkan terima kasih.
              </Text>
            </>
          ) : (
            <></>
          )}

          {/* PURCHASE AGREEMENT */}
          <div>
            <div style={styles.footerLayout}>
              <div style={styles.footerColumnLeft}>
                {props.data.type == "Penawaran" ? (
                  <></>
                ) : (
                  <>
                    <Text style={styles.footerTextBold}>
                      PURCHASE AGREEMENT:
                    </Text>
                    <Text style={styles.footerText}>
                      1. Pembeli diharuskan untuk melakukan pembayaran muka
                      sebesar {props.data.dp}% dari total pembelian.
                    </Text>
                    <Text style={styles.footerText}>
                      2. Pembeli harus menyelesaikan pembayaran sisa tagihan
                      sebelum barang dikirimkan.
                    </Text>
                    <Text style={styles.footerText}>
                      3. Waktu pelaksanaan pengerjaan berkisar antara{" "}
                      {props.data.estimatedTime}, dengan kemungkinan
                      penyelesaian lebih cepat.
                    </Text>
                    <Text style={styles.footerText}>
                      4. Kami mengutamakan kepuasan pelanggan kami sebagai
                      prioritas utama.
                    </Text>

                    <Text style={{ ...styles.textBold, ...{ marginTop: 5 } }}>
                      NOTES:
                    </Text>
                    <Text style={styles.text}>
                      Pembayaran dilakukan Via Transfer BCA: 549-503-9932 A/N
                      ALVINO SETIO
                    </Text>
                    <Text style={styles.text}>{props.data.memo}</Text>
                  </>
                )}
              </div>

              <div style={styles.footerColumnRight}>
                <Text style={styles.text}>Hormat kami,</Text>
                {props.data.isPreSigned ? (
                  <Image style={styles.imageTTD} src="/ttd.png" />
                ) : (
                  <Image style={styles.imageNoTTD} src="/ttd.png" />
                )}

                <Text style={styles.text}>Alvino Setio</Text>
                <Text style={styles.text}>Direktur Utama</Text>
              </div>
            </div>
          </div>
        </div>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default InvoiceGenerator;
