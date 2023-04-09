
const { Schema, model, default: mongoose } = require('mongoose')

const userSchema = new Schema({
    User_name: String,
    User_phone: String,
    User_email: String,
    User_role: String,
    User_company_id: String,
    User_status: String,
    User_password: String,
}, {
    timestamps: true
});


const User = model('User', userSchema)

module.exports = User








