exports._arrSummation = (arr, value) => {
   var result = arr.reduce(function (acc, obj) { return parseInt(acc) + parseInt(obj[value]); }, 0);
   return result
 }