const validator = require('validator')

const validate = data => {
   let error = {}

   if (!data.Production_date) {
      error.Production_date = "Please Enter Date !⚠️"
   }
   if (!data.Production_shift) {
      error.Production_shift = "Please Enter Shift !⚠️"
   }
   if (!data.Production_amount) {
      error.Production_amount = "Something went wrong⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate
