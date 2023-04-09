const validator = require('validator')

const validate = client => {
   let error = {}
   if (!client.Client_name) {
      error.Client_name = "! Please Enter client Name ⚠️"
   } else if (client.Client_name.length < 2) {
      error.Client_name = '! Please Enter Valid client Name ⚠️'
   }
   if (!client.Client_phone) {
      error.Client_phone = "! Please Enter client Phone ⚠️"
   } else if (client.Client_phone.length < 11) {
      error.Client_phone = "! Please Enter Valid phone ⚠️"
   }
   if (!client.Client_address) {
      error.Client_address = "! Please Enter client Address ⚠️"
   }
   if (!client.Client_email) {
      error.Client_email = "Please Provide Client Email ! ⚠️"
   } else if (!validator.isEmail(client.Client_email)) {
      error.Client_email = "Please Provide a Valid Email ⚠️"
   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate



// Client_name: String,
//    Client_phone: String,
//       Client_address: String,
//          Client_email: String,