
const validate = data => {
   let error = {}
   if (!data.Payment_date) {
      error.Payment_date = "! Please Enter Date !  ⚠️"
   } 
   if (!data.Receipt_no) {
      error.Receipt_no = '! Please Enter Receipt No ! ⚠️'
   } 
   if (!data.Client_id) {
      error.Client_id = "! Please Select Client ! ⚠️"
   }

   if (!data.Receive_amount) {
      error.Receive_amount = "! Please Enter Amount ⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate


