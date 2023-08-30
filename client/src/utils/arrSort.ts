
// export const _arrShortAss = (x, y) => {
//    x.sort(function (a, b) {
//      var keyA = a[y],
//        keyB = b[y]
//      // Compare the 2 dates
//      if (keyA < keyB) return -1;
//      if (keyA > keyB) return 1;
//      return 0;
//    });
//  }




export const _arrShortByKey = (arr: any[], key: string, ascending: boolean = true) => {

   const sortedArray = [...arr]; // Create a copy of the original array
   sortedArray.sort((a, b) => {
      if (a[key] < b[key]) {
         return ascending ? -1 : 1;
      }
      if (a[key] > b[key]) {
         return ascending ? 1 : -1;
      }
      return 0;
   });
   return sortedArray;
}