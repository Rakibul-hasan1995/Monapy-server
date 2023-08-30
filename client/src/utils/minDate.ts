



export const _getMaxDate = (arr: any[], dateKey: string | number) => {
   const maxDate = arr.reduce((min, obj) => {
      const currentDate = new Date(obj[dateKey]);
      return currentDate > min ? currentDate : min;
   }, new Date(arr[0][dateKey]));
   return maxDate
}
export const _getMinDate = (arr: any[], dateKey: string | number) => {
   const maxDate = arr.reduce((min, obj) => {
      const currentDate = new Date(obj[dateKey]);
      return currentDate < min ? currentDate : min;
   }, new Date(arr[0][dateKey]));
   return maxDate
}