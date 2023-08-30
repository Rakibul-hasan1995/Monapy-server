/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "../../components/Layout";
import GroupChart from "../../components/charts/groupChart";
import Table from "../../components/ag-grid/Table";
import { useInvoiceStateValue, useInvoiceStateXY } from "../../store/invoice";
import useInvoice from "./hooks/useInvoice";
import IconButton from "../../components/buttons/iconButton";
import { useNavigate } from "react-router-dom";

function Invoice() {
  const navigate = useNavigate()
  const { value } = useInvoiceStateValue()
  const { columnDefs, getFilteredData, pinnedBottomRowData } =
    useInvoice(value);

  const { inv_XY } = useInvoiceStateXY()
  return (
    <Layout title="Invoices" navButton={<IconButton classNames="mx-3" onClick={() => navigate('create')} />}>
      <div className="flex flex-wrap-reverse">
        <div className="w-full md:w-[60%]">
          <Table
            columnDefs={columnDefs}
            rowData={Object.values(value)}
            onFilterChanged={getFilteredData}
            pinnedBottomRowData={pinnedBottomRowData}
          />
        </div>
        <div className="w-full  ml-3 md:w-[39%] my-auto">
          <GroupChart chartData={inv_XY} title="Invoices" height={250} />
        </div>
      </div>
    </Layout>
  );
}

export default Invoice;
