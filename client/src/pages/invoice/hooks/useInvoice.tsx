import * as React from "react";
import moment from "moment";
import { numberWithCommas } from "../../../utils/numberFormater";
import RandersImage from "../../../components/RandersImage";
import { _arrSum } from "../../../utils/arrSum";
import { Invoice } from "../../../store/invoice";
import { Link } from "react-router-dom";
import { EyeIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { getInvoicePdf } from "../../../services/getInvoicePdf";

const randierLink = (params: { value: string }) => {
  if (!params.value) {
    return <></>;
  }
  return (
    <>
      <button onClick={() => getInvoicePdf(params.value)} className="mx-3">
        <PrinterIcon className="w-7 h-7 text-blue-600 hover:text-orange-800 dark:text-base dark:hover:text-blue-300 hover:translate-x-1 transition-all" />
      </button>
      <Link to={`/rbs/v2/invoices/${params.value}`}>
        <EyeIcon className="w-7 h-7 text-blue-600 hover:text-orange-800 dark:text-base dark:hover:text-blue-300 hover:translate-x-1 transition-all" />
      </Link>
    </>
  );
};

export default function useInvoice(value: Record<string, Invoice >) {
  
  const columnDefs = [
    {
      field: "Invoice_date",
      headerName: "Date",
      filter: true,
      valueFormatter: (params: { value: moment.MomentInput }) =>
        moment(params.value).format("DD-MMM-YY"),
    },
    {
      field: "Client_id.Client_name",
      headerName: "Clients",
      filter: true,
    },
    {
      field: "Invoice_no",
      headerName: "Invoice No",
      filter: true,
      sort: "desc",
    },
    {
      field: "Client_bill_no",
      headerName: "Client Bill No",
      filter: false,
      maxWidth: 80,
    },
    {
      field: "Invoice_amount",
      headerName: "Amount",
      filter: false,
      valueFormatter: (params: { value: any }) =>
        numberWithCommas(params.value),
      cellStyle: { justifyContent: "right" },
      type: "numericColumn",
    },
    {
      field: "image",
      headerName: "Design",
      filter: false,
      cellStyle: { padding: 8 },
      cellRenderer: RandersImage,
      maxWidth: 100,
      editable: false,
    },
    {
      field: "_id",
      headerName: "Action",
      filter: false,
      cellRenderer: randierLink,
      cellStyle: { justifyContent: "center" },
      headerClass: "justify-center",
    },
  ];

  // pinned Bottom row functions ----------->>>>
  const [sumAmount, setSumAmount] = React.useState(0);

  React.useEffect(() => {
    const ordersArr = Object.values(value);
    getAmount(ordersArr);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const getFilteredData = (x: { api: any; columnApi: any }) => {
    const { api, columnApi } = x;
    if (api == null || columnApi == null) {
      return;
    }
    const items: any[] = [];
    api.forEachNodeAfterFilter(function (node: { data: any }) {
      items.push(node.data);
    });
    getAmount(items);
    return items;
  };

  const getAmount = (arr: any[]) => {
    const sumInvoiceAmount2 = _arrSum(arr, "Invoice_amount");
    setSumAmount(sumInvoiceAmount2);
  };

  const pinnedBottomRowData = [
    {
      Client_name: "Total",
      Invoice_no: "",
      Invoice_amount: sumAmount,
    },
  ];


  // pinned Bottom row functions -----------<<<

  return {
    columnDefs,
    getFilteredData,
    pinnedBottomRowData,
  };
}
