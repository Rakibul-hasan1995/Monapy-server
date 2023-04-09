
const { Schema, model } = require('mongoose')

const invoiceSchema = new Schema({
    Invoice_date: Date,
    Invoice_no: String,
    Client_bill_no: Number,
    Client_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Client'
    },
    Invoice_amount: Number,
    Discount: Number,
    Status: {
        type: String,
        default: 'Created'
    },
    Items: [{
        type: Schema.ObjectId,
        required: true,
        ref: 'Order'
    }],
    Comments: String,
}, {
    timestamps: true
});

const Invoice = model('Invoice', invoiceSchema)

module.exports = Invoice