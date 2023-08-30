/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import useOrderReport from '../../report/hooks/useOrderReoport'
import Table from '../../../components/ag-grid/Table'
import RandersOrderProgress from '../../../components/progressBar/randerOrderProgress'
import RandersImage from '../../../components/RandersImage'
import RandierLink from '../../../components/randerLInkButton'
import OrderServices from '../../../services/api/ordersServices'
import { useStoreState } from '../../../store/store'
import { useParams } from 'react-router-dom'
import { numberWithCommas } from '../../../utils/numberFormater'



export default function ClientOrders() {

   const activePage = useParams();
   const client_id = activePage._id || "";

   const columnDefs = [
      // {
      //    field: "Client_name",
      //    headerName: "Client",
      //    filter: true,
      //    // floatingFilter: true,
      // },
      {
         field: "Order_no",
         headerName: "Order-No",
         filter: true,
         minWidth: 120,
         editable: false,
         // sort: "desc",
         // floatingFilter: true,
      },
      {
         field: "Order_qty",
         headerName: "Order-Qty",
         filter: false,
         editable: false,
         cellStyle: { justifyContent: "center" },
      },
      {
         field: "Order_rate",
         headerName: "Rate",
         filter: false,
         valueFormatter: ({ value }: { value: any }) => {
            if (!value) {
               return "";
            }
            return numberWithCommas(parseInt(value));
         },
         editable: false,
         cellStyle: { justifyContent: "right" },

      },
      {
         field: "receivedQty",
         headerName: "Rec-Qty",
         filter: false,
         cellStyle: { justifyContent: "center" },
      },

      {
         field: "deliveredQty",
         headerName: "Del-Qty",
         filter: false,
         cellStyle: { justifyContent: "center" },
      },

      {
         field: "ProductionQty",
         headerName: "Production Qty",
         filter: false,
         cellRenderer: RandersOrderProgress,
      },
      {
         field: "Item_avatar",
         headerName: "Design",
         filter: false,
         cellStyle: { padding: 8 },
         cellRenderer: RandersImage,
         maxWidth: 100,
         editable: true,
      },
      {
         field: "Order_status",
         headerName: "Status",
         filter: true,
         cellClass: (params: { value: any }) => `status-${params.value}`,
         cellStyle: { justifyContent: "center" },
         editable: false,
         cellEditor: "agSelectCellEditor",
         maxWidth: 150,

         cellEditorParams: {
            values: [
               "Complete",
               "Placed",
               "Processing",
               "Hold",
               "Invoiced",
               "Reject",
               "Sub-Contact",
            ],
         },
      },
      {
         field: "_id",
         headerName: "Action",
         filter: false,
         cellRenderer: (params: { value: any }) => (
            <RandierLink href={`/rbs/v2/orders/${params.value}`} />
         ),
         cellStyle: { justifyContent: "center" },
      },
   ];

   const tampState = useStoreState((state) => state.order.tempData)
   const orders = tampState[`Client_id=${client_id}`]
   React.useEffect(() => {
      if (client_id) {
         OrderServices.getOrdersWithQuery(`Client_id=${client_id}`)
      }
   }, [])


   const { getFilteredData, pinnedBottomRowData } =
      useOrderReport();
   return (
      <div>
         <Table
            columnDefs={columnDefs}
            rowData={Object.values(orders || [])}
            onFilterChanged={getFilteredData}
            pinnedBottomRowData={pinnedBottomRowData}
            pagination
         />
      </div>
   )
}
