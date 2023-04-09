
/**
 * 
 * @param {Number} x  / 30 to get past 30 days from today
 * @returns 
 */
export const _passDate = (x) => {
   var d = new Date();
   d.setDate(d.getDate() - x);
   return d
}

/**
 * 
 * @param {Array} arr / arr for filtering
 * @param {String} dateKey  / property name of date
 * @param {Date} startDate  / range start date |  default = 30 days
 * @param {Date} endDate / default = today
 * @param {Boolean} isFriday / filter Friday
 * @returns ranged array
 */
const _rangedData = (arr = [], dateKey = 'date', startDate = 30, endDate = new Date(), isFriday = true) => {
   const _startDate = _passDate(startDate);
   // var endDate = new Date();
   const rangeData = arr?.filter((a) => {
      var date = new Date(a[dateKey]);
      return date >= _startDate && date <= endDate;
   });
   if (!isFriday) {
      return rangeData
   } else {
      const f = []
      for (let index = 0; index < rangeData.length; index++) {
         const element = rangeData[index];
         if (!Boolean(checkIsFriday(element[dateKey]))) {
            f.push(element)
         }
         // f.push(element)
         // console.log(element[dateKey]);
      }

      return f
   }
}


function checkIsFriday(date) {
   const x = new Date(date)
   const p = x.getDay() === 5;
   if (p == true) {
   }
   return p
}




export default _rangedData