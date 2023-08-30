import { useParams } from "react-router-dom";
import Table from "../../../components/ag-grid/Table";
import deliveryColDef from "../../../components/ag-grid/colDefs/delivery";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import DeliveryServices from "../../../services/api/deliveryServices";
import { Delivery } from "../../../store/delivery";


export default function OrderDelivery() {
   const activePage = useParams()
   const Order_id = activePage._id
   const [data, setData] = useState<Delivery[]>([])

   useEffect(() => {
      if (Order_id?.length) {
         getData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [Order_id])


   const getData = async () => {
      const rec = await DeliveryServices.getDelQuery(`Order_id=${Order_id}`)
      console.log(rec)
      setData(Object.values(rec))
   }
   const orderNo = data[0]?.Order_id.Order_no


   return (
      <Layout title={orderNo+ ' / Delivery'}>
         <div className="max-w-4xl mx-auto">
            <Table
               rowData={data}
               columnDefs={deliveryColDef}
            // onCellValueChanged={({ data }) => edit(data)}
            />
         </div>
      </Layout>
   )
}
