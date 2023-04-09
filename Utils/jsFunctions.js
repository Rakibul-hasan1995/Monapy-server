
/**
 * 
 * @param {Array} arr pass array to get sum 
 * @param {string} key pass key  
 * @returns 
 */
exports._arrSummation = (arr, key) => {
   var result = arr.reduce(function (acc, obj) { return parseInt(acc) + parseInt(obj[key]); }, 0);
   return result
}

/**
 * 
 * @param {Array} arr  parr array to convert to object By _id
 * @returns Object [key = _id = data]
 */
exports._arrToObjBy_id = (arr) => {
   return arr.reduce((a, i) => ({ ...a, [i._id]: i }), {})

}


/**
 * 
 * @param {Number} length Of Random String
 * @returns Random String
 */
exports._randomString = (length) => {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
         charactersLength));
   }
   return result;
}