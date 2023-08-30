import { useParams } from "react-router-dom";
import Table from "../../../components/ag-grid/Table";
import { useEffect, useState } from "react";
import ReceiveServices from "../../../services/api/receivedServices";
import { Receive } from "../../../store/receive";
import Layout from "../../../components/Layout";
import receiveColDef from "../../../components/ag-grid/colDefs/receve";


export default function OrderReceive() {
   const activePage = useParams()
   const Order_id = activePage._id
   const [data, setData] = useState<Receive[]>([])

   useEffect(() => {
      if (Order_id?.length) {
         getData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [Order_id])


   const getData = async () => {
      const rec = await ReceiveServices.getRecQuery(`Order_id=${Order_id}`)
      setData(Object.values(rec))
   }
   const orderNo = data[0]?.Order_id.Order_no


   return (
      <Layout title={orderNo+ ' / Receive'}>
         <div className="max-w-4xl mx-auto">
            <Table
               rowData={data}
               columnDefs={receiveColDef}
            // onCellValueChanged={({ data }) => edit(data)}
            />
         </div>
      </Layout>
   )
}
