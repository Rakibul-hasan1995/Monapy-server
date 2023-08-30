import moment from "moment";
import Layout from "../../components/Layout";
import Table from "../../components/ag-grid/Table";
import useInvoiceDetails from "./hooks/useInvoiceDetails";
import { PrinterIcon } from "@heroicons/react/24/outline";
import { getInvoicePdf } from "../../services/getInvoicePdf";
import OrderServices from "../../services/api/ordersServices";
import { Link } from "react-router-dom";

export default function InvoiceDetails() {
  const { item, columnDefs, pinnedBottomRowData } = useInvoiceDetails();

  return (
    <Layout title={item?.Invoice_no || ""} active="Invoices">
      <div className="relative">
        <div className="absolute top-0 right-0 gap-2 grid grid-cols-1">
          <button
            onClick={() => getInvoicePdf(item._id)}
            className="bg-blue-400 hover:bg-blue-600 text-white transition-all font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <PrinterIcon className="w-4 h-6" />
          </button>
        </div>

        <div className="bg-base-lt rounded-sm shadow-md dark:bg-base-dark max-w-4xl h-full mx-auto p-3 lg:p-16">
          <div className="topInfo">
            <div className="grid grid-cols-2">
              <div className="left">
                <p className="text-sm py-1">Bill To</p>
                <p className="text-sm py-1"><Link to={`/rbs/v2/clients/${item?.Client_id._id}/profile`}>{item?.Client_id?.Client_name}</Link></p>
                <p className="text-sm py-1">{item?.Client_id?.Client_address}</p>
                <p className="text-sm py-3 font-semibold">
                  Sub: Bill For Embroidery
                </p>
              </div>
              <div className="right ml-auto">
                <p className="text-sm py-1">
                  Invoice Date: {moment(item?.Invoice_date).format("DD-MMM-YY")}
                </p>
                <p className="text-sm py-1">Invoice No: {item?.Invoice_no}</p>
                <p className="text-sm py-1">Bill No: {item?.Client_bill_no}</p>
              </div>
            </div>
          </div>
          <Table
            columnDefs={columnDefs}
            rowData={item?.Items}
            onCellValueChanged={({ data }) => OrderServices.updateOrder(data)}
            pagination={false}
            pinnedBottomRowData={pinnedBottomRowData}
            defaultColDef={{
              flex: 1,
              filter: false,
              dndSource: false,
              floatingFilter: false,
              sortable: false,
              resizable: false,
              editable: true,
            }}
          />
        </div>
      </div>
    </Layout>
  );
}
