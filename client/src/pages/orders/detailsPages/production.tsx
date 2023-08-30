import { useParams } from "react-router-dom";
import Table from "../../../components/ag-grid/Table";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import ProductionServices from "../../../services/api/productionServices";
import { Production } from "../../../store/production";
import productionColDef from "../../../components/ag-grid/colDefs/production";


export default function OrderProductions() {
   const activePage = useParams()
   const Order_id = activePage._id
   const [data, setData] = useState<Production[]>([])

   useEffect(() => {
      if (Order_id?.length) {
         getData()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [Order_id])


   const getData = async () => {
      const rec = await ProductionServices.getProductionQueryByOrder_id(Order_id || '')
      setData(Object.values(rec))
   }
   const orderNo = data[0]?.Production_data[0]?.Order_no

   return (
      <Layout title={orderNo + ' / Productions'}>
         <div className="max-w-4xl mx-auto">
            <Table
               rowData={data}
               columnDefs={productionColDef}
            // onCellValueChanged={({ data }) => edit(data)}
            />
         </div>
      </Layout>
   )
}
