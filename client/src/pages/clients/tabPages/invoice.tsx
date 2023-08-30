/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import Table from '../../../components/ag-grid/Table'
import useInvoice from '../../invoice/hooks/useInvoice'
import InvoiceServices from '../../../services/api/invoiceServices'
import { useStoreState } from '../../../store/store'
import { useParams } from 'react-router-dom'




export default function ClientInvoice() {
   const activePage = useParams();
   const client_id = activePage._id || "";

   // const [data, setData] = React.useState<Record<string, Invoice>>({})
   const tempData = useStoreState((state) => state.invoice.tempData)
   const data = tempData[`Client_id=${client_id}`]
   React.useEffect(() => {
      if (client_id) {
         InvoiceServices.getInvoiceQuery(`Client_id=${client_id}`)
      }
   }, [client_id])
   const { columnDefs, getFilteredData, pinnedBottomRowData } = useInvoice(data || [])

   return (
      <div>
      <Table
         columnDefs={columnDefs}
         rowData={Object.values(data || [])}
         onFilterChanged={getFilteredData}
         pinnedBottomRowData={pinnedBottomRowData}
         pagination
      />
   </div>
   )
}
