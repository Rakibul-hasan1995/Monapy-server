
import { _arrSum } from "../utils/arrSum";
import { useProductionXY } from "../store/production";
import { getCurrentMonthData, getLast30DaysData } from "../utils/groupingData";
// import _groupData from "../utils/groupData";

export default function useDashBoard() {

  const { _groupDataXY } = useProductionXY()
  const prodLast30DaysXY = getLast30DaysData(_groupDataXY);
  const prodLast30DaysTotal = _arrSum(prodLast30DaysXY, "y");
  const prodCurrentMonthXY = getCurrentMonthData(_groupDataXY);
  const prodCurrentMonthTotal = _arrSum(prodCurrentMonthXY, "y");

  return {
    prodLast30DaysTotal,
    prodLast30DaysXY,
    prodCurrentMonthTotal,
    prodCurrentMonthXY,
  };
}




