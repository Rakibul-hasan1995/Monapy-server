import moment from "moment";
import { numberWithCommas } from "../../../utils/numberFormater";
import RandersOrderProgress from "../../progressBar/randerOrderProgress";
import RandersImage from "../../RandersImage";
import RandierLink from "../../randerLInkButton";

const OrderColDef = [
   {
     field: "Order_date",
     headerName: "Date",
     valueFormatter: ({ value }: { value: moment.MomentInput }) =>
       moment(value).format("DD-MMM-YY"),
     filter: true,
   },
   {
     field: "Order_no",
     headerName: "Order No",
     filter: true,
     minWidth: 200,
     editable: true,
   },
   {
     field: "Order_sl",
     headerName: "SL",
     filter: true,
     editable: false,
   },
   {
     field: "stitch",
     headerName: "Stitch",
     filter: false,
     editable: true,
   },
   {
     field: "Order_qty",
     headerName: "Qty",
     filter: false,
     editable: true,
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

     editable: true,
   },
   {
     field: "ProductionQty",
     headerName: "Production Qty",
     filter: false,
     cellRenderer: RandersOrderProgress,
     cellStyle: { paddingTop: 15 },
     editable: true,
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
     editable: true,
     cellEditor: "agSelectCellEditor",
     maxWidth: 150,
     sort: "desc",
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



 export default OrderColDef