import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import IconButton from "../../components/buttons/iconButton";
import Table from "../../components/ag-grid/Table";
import usePayment from "./hooks/usePayments";
import GroupChart from "../../components/charts/groupChart";
import { usePaymentStateXY } from "../../store/payments";

export default function Payments() {
   const navigate = useNavigate()
   const { columnDefs,
      getFilteredData,
      pinnedBottomRowData, value } = usePayment()

   const { paymentXY } = usePaymentStateXY()
   return (
      <Layout title="Payments" navButton={<IconButton classNames="mx-3" onClick={() => navigate('create')} />} >
         <div className="flex flex-wrap">
            <div className="w-full   md:w-[60%] ">
               <Table
                  rowData={Object.values(value)}
                  columnDefs={columnDefs}
                  // onCellValueChanged={({ data }) => edit(data)}
                  pinnedBottomRowData={pinnedBottomRowData}
                  onFilterChanged={getFilteredData}
               />
            </div>
            <div className="w-full  ml-3 md:w-[39%] my-auto">
               <GroupChart chartData={paymentXY} title="Payments" height={250} />
            </div>
         </div>
      </Layout>
   )
}
