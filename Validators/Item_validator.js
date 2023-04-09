
const validate = item => {
   let error = {}
   if (!item.Item_name) {
      error.Item_name = "! Please Enter Item Name ⚠️"
   } else if (item.Item_name.length < 2) {
      error.Item_name = '! Please Enter Valid Item Name ⚠️'
   }
   if (!item.Item_type) {
      error.Item_type = "! Please Enter Item Type ⚠️"
   }
   if (!item.Item_unit) {
      error.Item_unit = "! Please Enter Item Unit ⚠️"
   }
   if (!item.Item_stitch) {
      error.Item_stitch = "! Please Enter Item Stitch ⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate
