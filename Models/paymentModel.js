
const { Schema, model, default: mongoose } = require('mongoose')

const paymentSchema = new Schema({
    Payment_date: Date,
    Client_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Client'
    },
    Receipt_no: String,
    Payment_description: String,
    Payment_mode: {
        type: String,
        default: 'Cash'
    },
    Receive_amount: Number
}, {
    timestamps: true
});


const Payment = model('Payment', paymentSchema)

module.exports = Payment








