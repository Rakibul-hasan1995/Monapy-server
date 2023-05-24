
const validate = data => {
   let error = {}
   if (!data.Delivery_date) {
      error.Delivery_date = "! Please Enter Date !  ⚠️"
   }
   if (!data.Delivery_ch_no) {
      error.Delivery_ch_no = '! Please Enter Chalan No ! ⚠️'
   }
   if (!data.Client_id) {
      error.Client_id = "! Please Select Client ! ⚠️"
   }
   if (!data.Order_id) {
      error.Order_id = "! Please Select Order ⚠️"
   }
   if (!data.Delivery_qty) {
      error.Delivery_qty = "! Please Enter Qty ⚠️"
   } else if (data.Delivery_qty === 0) {
      error.Delivery_qty = "! Please Enter Qty ⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate

