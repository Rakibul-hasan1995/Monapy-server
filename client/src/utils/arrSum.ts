
export const _arrSum = (arr: any[], key: string | number) => {
  if (!arr) {
    return null
  }
   return arr.reduce((sum, item) => sum + item[key], 0);
 };