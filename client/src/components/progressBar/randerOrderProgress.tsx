import ProgressBar from "./progressBar";

const RandersOrderProgress = (x: {
   data: { Order_qty: any; ProductionQty: any };
 }) => {
   const { Order_qty, ProductionQty } = x.data;
   const percentage = (ProductionQty / Order_qty) * 100;
   if (Number.isNaN(percentage)) {
     return <></>;
   }

   return (
     <ProgressBar
       toolTipValue={ProductionQty}
       progress={parseInt(percentage.toFixed(1))}
     />
   );
 };
 export default RandersOrderProgress