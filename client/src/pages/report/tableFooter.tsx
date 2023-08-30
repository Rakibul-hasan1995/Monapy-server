import useOrderReport from "./hooks/useOrderReoport"

export default function ReportTableFooter() {


   const { footerData } = useOrderReport()

   const { Order_qty, receivedQty, deliveredQty, ProductionQty } = footerData



   return (
      <table className="w-full p-5">
         <tr className="py-2">
            <th className="border-r-2" colSpan={2}>Total</th>
            <th className="border-r-2" >Order Qty : {Order_qty}</th>
            <th className="border-r-2" >Rec Qty: {receivedQty}</th>
            <th className="border-r-2" >Del Qty : {deliveredQty}</th>
            <th className="border-r-2" >Productions Qty : {ProductionQty}</th>
         </tr>
      </table>
   )
}
