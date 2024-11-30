import { StyleSheet } from "@react-pdf/renderer";
export const ExportReceiptStyle = StyleSheet.create({
  body: {
    fontSize: 6,
    paddingTop: 10,
    paddingBottom: 30,
    paddingHorizontal: 5,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 6,
    textAlign: "center",
  },
  text: {
    fontFamily: "Inter",
    fontSize: 6,
    textAlign: "left",
    marginBottom: 2,
  },
  totalPrice: {
    marginTop: 10,
    fontFamily: "Inter",
    fontSize: 6,
    textAlign: "right",
    fontWeight: 700,
    marginBottom: 1,
  },
  textE: {
    fontFamily: "Inter",
    fontSize: 6,
    textAlign: "justify",
  },
  p: {
    fontFamily: "Inter",
    fontSize: 6,
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
    fontSize: 6,
    textAlign: "center",
  },
  textBold: {
    fontFamily: "Inter",
    fontSize: 6,
    textAlign: "justify",
    fontWeight: 700,
    marginBottom: 2,
  },
  pageNumber: {
    position: "absolute",
    fontSize: 6,
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
    alignItems: "flex-start",
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
  },
  main: {
    padding: 20,
  },
  tableRowHeader: {
    flexDirection: "row",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    textAlign: "left",
    width: "60%",
  },
  tableColQty: {
    width: "2%",
    fontSize: 6,
  },
  tableColMin: {
    width: "10%",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColPrice: {
    width: "30%",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol4First: {
    width: "60%",
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableCol4: {
    width: "40%",
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColNameWidth: {
    width: "20%",
    borderStyle: "solid",
    borderLeftWidth: 1,
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
  },
  tableCell: {
    fontSize: 6,
    textAlign: "left",
  },
  tableCellCenter: {
    fontSize: 5,
  },

  footerTextBold: {
    fontFamily: "Inter",
    fontSize: 6,
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
  footerColumnLeftSA: {
    flex: 2,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sign: {
    textAlign: "center",
    border: "1px",
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
export const ExportInvoiceStyle = StyleSheet.create({
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
    textAlign: "left",
  },
  tableColQty: {
    width: "5%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColMin: {
    width: "10%",
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
  tableCol4First: {
    width: "60%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 0,
  },
  tableCol4: {
    width: "40%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableColNameWidth: {
    width: "20%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 1,
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
    textAlign: "left",
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
  footerColumnLeftSA: {
    flex: 2,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sign: {
    textAlign: "center",
    border: "1px",
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
