const validator = require('validator')

const validate = User => {
   let error = {}
   if (!User.User_name) {
      error.User_name = "! Please Enter User Name !"
   } else if (User.User_name.length < 2) {
      error.User_name = '! Please Enter Valid User Name !'
   }
   if (!User.User_phone) {
      error.User_phone = "! Please Enter User Phone ! ⚠️ "
   } else if (User.User_phone.length < 11) {
      error.User_phone = "! Please Enter Valid phone ! ⚠️ "
   }
   if (!User.User_email) {
      error.User_email = "Please Provide User Email ! ⚠️ "
   } else if (!validator.isEmail(User.User_email)) {
      error.User_email = "Please Provide a Valid Email ⚠️ "
   }

   if (!User.User_password) {
      error.User_password = "Please Provide User Password ! ⚠️ "
   } else if (User.User_password.length < 4) {
      error.User_password = "Please Provide a Valid Password ! ⚠️ "
   }
   if (User.User_password !== User.Confirm_password) {
      error.Confirm_password = "Password Doesn't Match ! ⚠️ "

   }
   return {
      error,
      isValid: Object.keys(error).length === 0
   }
}

module.exports = validate
