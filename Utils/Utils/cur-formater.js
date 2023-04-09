// Create our number formatter.





/**
 * 
 * @param {String} str 
 * @param {String} currency / USD / BDT
 * @returns Currency 
 */
export function _currencyFormat(str = 0, currency = 'BDT') {
  let c = Number(str).toFixed(2)

  // var formatter = new Intl.NumberFormat('en-IN', {
  // style: 'currency',
  //  currency: currency,
  //  currencyDisplay: "narrowSymbol",
  // });
  // return formatter.format(c);
  // return new Intl.NumberFormat('en-IN').format(c)
  return c.replace(/\d(?=(\d{3})+\.)/g, '$&,');

}