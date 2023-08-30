


export const numberWithCommas = (x: number| any) => {
   const d = x?.toFixed(2) || 0
   return d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}