 import moment from "moment";
import { _currencyFormat } from "./cur-formater";
import { DateFormate } from "./dateFormate";

/**
 * 
 * @param {Array} arr  
 * @param {String} dateKey arr.date
 * @param {String} sumKey  amount / qty
 * @param {String} groupBy day / week / month
 * @param {String} dateFormate 'YYYY-MM-DD' | YY-DD-MM 
 */
const _groupData = (arr, dateKey, sumKey, groupBy = 'day', dateFormate = 'DD-MMM',) => {

   if (groupBy === 'month') {
      dateFormate = 'MMM-YYYY'
   }
   if (groupBy === 'year') {
      dateFormate = 'YYYY'
   }
   var data = arr.reduce(
      (acc, cur) => {
         const y = cur[sumKey]
         var x = moment(new Date(cur[dateKey]), "YYYY-MM-DD")
            .startOf(groupBy)
            .add(0, "days");
         acc[x]
            ? (acc[x].y += y)
            : (acc[x] = {
               x: DateFormate(x, dateFormate),
               y,
            });
         return acc;
      },
      {}
   );

   return data
}
export default _groupData

