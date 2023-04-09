
export function _arrToObjBy_id(arr) {
   return arr.reduce((a, i) => ({ ...a, [i._id]: i }), {})
 }