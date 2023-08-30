import moment from "moment";
import { numberWithCommas } from "../../../utils/numberFormater";
import RandierLink from "../../randerLInkButton";

const productionColDef = [
   {
      field: "Production_date",
      headerName: "Date",
      valueFormatter: ({ value }: { value: moment.MomentInput }) =>
         moment(value).format("DD-MMM-YY"),
      filter: true,
      sort: 'desc'
   },
   {
      field: "Production_shift",
      headerName: "Shift",
      filter: true,
   },

   {
      field: "Production_amount",
      headerName: "Amount",
      filter: false,
      valueFormatter: ({ value }: { value: any }) => {
         if (!value) {
            return "";
         }
         return numberWithCommas(parseInt(value));
      },
      cellStyle: { justifyContent: "right" },
   },

   {
      field: "_id",
      headerName: "Action",
      filter: false,
      cellRenderer: (params: { value: any }) => (
         <RandierLink href={`/rbs/v2/productions/${params.value}`} />
      ),
      cellStyle: { justifyContent: "center" },
   },
];

export default productionColDef


