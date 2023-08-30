import * as React from "react";
import moment from "moment";
import { numberWithCommas } from "../../../utils/numberFormater";
import { _arrSum } from "../../../utils/arrSum";
import { usePaymentStateValue } from "../../../store/payments";




export default function usePayment() {
   const { value } = usePaymentStateValue();


   const columnDefs = [
      {
         field: "Payment_date",
         headerName: "Date",
         valueFormatter: ({ value }: { value: moment.MomentInput }) =>
            moment(value).format("DD-MMM-YY"),
         filter: true,
         sort: 'desc'
      },
      {
         field: "Client_id.Client_name",
         headerName: "Client",
         filter: true,
      },
      {
         field: "Receipt_no",
         headerName: "MRC No",
         filter: true,
      },
      {
         field: "Payment_description",
         headerName: "Description",
         filter: false,
         editable: true,
      },
      {
         field: "Payment_mode",
         headerName: "Mode",
         filter: false,

      },
      {
         field: "Receive_amount",
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
      // {
      //    field: "_id",
      //    headerName: "Action",
      //    filter: false,
      //    cellRenderer: (params: { value: any }) => (
      //       <RandierLink href={`/rbs/v2/orders/${params.value}`} />
      //    ),
      //    cellStyle: { justifyContent: "center" },
      // },
   ];




   // pinned Bottom row functions ----------->>>>
   const [amount, setAmount] = React.useState(0);

   React.useEffect(() => {

      getAmount(Object.values(value));

      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [value]);

   const getFilteredData = (x: { api: any; columnApi: any }) => {
      const { api, columnApi } = x;
      if (api == null || columnApi == null) {
         return;
      }
      const items: any[] = [];
      api.forEachNodeAfterFilter(function (node: { data: any }) {
         items.push(node.data);
      });
      getAmount(items);
      return items;
   };

   const getAmount = (arr: any[]) => {
      const Receive_amountSum = _arrSum(arr, "Receive_amount");
      setAmount(Receive_amountSum);
   };

   const pinnedBottomRowData = [
      {
         Payment_description: "Total",
         Receive_amount: amount,
      },
   ];

   // pinned Bottom row functions -----------<<<

   return {
      columnDefs,
      getFilteredData,
      pinnedBottomRowData,
      value
   };
}
