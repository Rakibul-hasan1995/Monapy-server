import * as React from "react";
import { _arrSum } from "../../../utils/arrSum";
import { useProductionState } from "../../../store/production";




export default function useProductions() {
   const { value } = useProductionState();


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
      const Production_amountSum = _arrSum(arr, "Production_amount");
      setAmount(Production_amountSum);
   };

   const pinnedBottomRowData = [
      {
         Production_shift: "Total",
         Production_amount: amount,
      },
   ];

   // pinned Bottom row functions -----------<<<

   return {
    
      getFilteredData,
      pinnedBottomRowData,
      value
   };
}
