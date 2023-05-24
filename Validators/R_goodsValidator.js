
const validate = data => {
   let error = {}
   if (!data.Receive_date) {
      error.Receive_date = "! Please Enter Date !  ⚠️"
   }
   if (!data.Receive_ch_no) {
      error.Receive_ch_no = '! Please Enter Chalan No ! ⚠️'
   }
   if (!data.Client_id) {
      error.Client_id = "! Please Select Client ! ⚠️"
   }
   if (!data.Order_id) {
      error.Order_id = "! Please Select Order ⚠️"
   }
   if (!data.Receive_qty) {
      error.Receive_qty = "! Please Enter Qty ⚠️"
   }
   if (data.Receive_qty === 0) {
      error.Receive_qty = "! Please Enter Qty ⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate
