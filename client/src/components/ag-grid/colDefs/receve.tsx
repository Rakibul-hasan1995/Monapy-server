import { ColDef } from "ag-grid-community";
import moment from "moment";
import RandersImage from "../../RandersImage";
import RandierLink from "../../randerLInkButton";
import { PaintBrushIcon } from "@heroicons/react/24/outline";


// eslint-disable-next-line react-refresh/only-export-components
const RenderActions = ({value}:{value: any})=>{
   return(
      <RandierLink icon={<PaintBrushIcon  className="w-7 h-7"/>} href={'update/'+value}   />
   )
}


const receiveColDef: ColDef[] = [
   {
      field: "Receive_date",
      headerName: "Date",
      valueFormatter: ({ value }: { value: moment.MomentInput }) =>
         moment(value).format("DD-MMM-YY"),
      filter: true,
   },
   {
      field: "Receive_ch_no",
      headerName: "CH NO",
      filter: true,
      cellStyle: { justifyContent: "center" },


   },
   {
      field: "Client_id.Client_name",
      headerName: "Client",
      filter: true,
   },
   {
      field: "Order_id.Order_no",
      headerName: "Order No",
      filter: true,
   },
   {
      field: "Receive_qty",
      headerName: "Qty",
      filter: true,
      editable: true,
      cellStyle: { justifyContent: "center" },
   },
   {
      field: "Order_id.Item_avatar",
      headerName: "Design",
      filter: false,
      cellStyle: { padding: 8 },
      cellRenderer: RandersImage,
      maxWidth: 100,
      editable: true,
   },
   {
      field: "_id",
      headerName: "Action",
      cellRenderer: RenderActions,
      cellStyle: { justifyContent: "center" },
   }


];


export default receiveColDef