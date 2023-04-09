exports.numberFormate = (x) => {
   const p = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   return p
 }