import * as React from "react";
import { Invoice } from "../../../store/invoice";
import { useParams } from "react-router-dom";
import RandersImage from "../../../components/RandersImage";
import { numberWithCommas } from "../../../utils/numberFormater";
import InvoiceServices from "../../../services/api/invoiceServices";

export default function useInvoiceDetails() {
  const [item, setItem] = React.useState<Invoice | any>();

  const activePage = useParams();
  const _id = activePage._id || "";

  React.useEffect(() => {
    if (_id.length) {
      getInvoicePdf()

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_id]);
  
  const getInvoicePdf = async () => {
    const data =await InvoiceServices.getInvoiceBy_id(_id)

    setItem(data)
  }

  const columnDefs = React.useMemo(
    () => [
      {
        field: "Order_no",
        headerName: "Style",
        filter: false,
        editable: true,
        minWidth: 200,
        // cellStyle: { justifyContent: "le" },
      },
      {
        field: "Item_avatar",
        headerName: "Design",
        filter: false,
        cellRenderer: RandersImage,
      },
      {
        field: "_id",
        headerName: "CH No",
        filter: false,
        valueFormatter: () => "",
        cellStyle: { justifyContent: "right" },
      },
      {
        field: "Order_qty",
        headerName: "Qty",
        cellStyle: { justifyContent: "center" },
        filter: false,
        editable: true,
      },
      {
        field: "Order_rate",
        headerName: "Rate",
        filter: false,
        valueFormatter: ({ value }: { value: any }) =>
          numberWithCommas(parseInt(value)),
        cellStyle: { justifyContent: "right" },
        type: "numericColumn",
      },
      {
        field: "Invoice_amount",
        headerName: "Amount",
        filter: false,
        valueGetter: function (params: {
          data: { Order_rate: number; Order_qty: number };
        }) {
          const Order_rate = params.data.Order_rate || 0;
          const Order_qty = params.data.Order_qty || 0;
          return Order_qty * Order_rate;
        },
        valueFormatter: ({ value }: { value: any }) =>
          numberWithCommas(parseInt(value)),
        cellStyle: { justifyContent: "right" },
        type: "numericColumn",
      },
    ],
    []
  );

  const pinnedBottomRowData = [
    {
      Order_no: `Discount Of Percent - '${item?.Discount}%'`,
    },
    {
      Order_no: `Amount - ${numberWithCommas(item?.Invoice_amount)}`,
    },

  ];

  // pinned Bottom row functions -----------<<<

  return { item, columnDefs, pinnedBottomRowData };
}
