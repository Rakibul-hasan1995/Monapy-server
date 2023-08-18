
const validate = Order => {
   let error = {}
   if (!Order.Order_no) {
      error.Order_no = "! Please Enter Order No !⚠️"
   } else if (Order.Order_no.length < 3) {
      error.Order_no = "! Please Enter Valid Order No !⚠️"
   }
   if (!Order.Order_date) {
      error.Order_date = "! Please Enter Order Date !⚠️"
   }
   if (!Order.Order_qty) {
      error.Order_qty = "Please Enter Order Qty !⚠️"
   }
   if (!Order.Order_rate) {
      error.Order_rate = "Please Enter Order Rate !⚠️"
   }
   if (!Order.Client_id) {
      error.Client_id = "Please Select An Client !⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate
