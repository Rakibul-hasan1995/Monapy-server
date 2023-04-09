
const validate = item => {
   let error = {}
   if (!item.Invoice_date) {
      error.Invoice_date = "! Please Enter Date ⚠️"
   }
   if (!item.Invoice_no) {
      error.Invoice_no = "! Please Enter Item Number ⚠️"
   }
   if (!item.Client_bill_no) {
      error.Client_bill_no = "! Please Select An Order ⚠️"
   }
   if (!item.Client_id) {
      error.Client_id = "! Please Select Client ⚠️"
   }
   if (!item.Items[0].length) {
      error.Items = "! Please Select Order ⚠️"
   }
   if (!item.Invoice_amount) {
      error.Invoice_amount = "! Something Went Wrong ⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate

