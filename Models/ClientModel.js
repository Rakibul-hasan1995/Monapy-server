
const { Schema, model } = require('mongoose')

const clientSchema = new Schema({
    Client_name: String,
    Client_phone: String,
    Client_address: String,
    Client_email: String,
    OpeningBalance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});


const Client = model('Client', clientSchema)

module.exports = Client