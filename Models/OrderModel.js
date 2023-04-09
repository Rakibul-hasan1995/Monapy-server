
const { Schema, model } = require('mongoose')

const orderSchema = new Schema({
    Order_no: String,
    Order_date: Date,
    Order_qty: Number,
    Order_rate: String,
    Order_sl: Number,
    ProductionQty: {
        type: Number,
        default: 0
    },
    stitch: {
        type: Number,
        default: 0
    },
    Order_status: {
        type: String,
        default: 'Processing'
    },
    Order_description: String,
    // Item_id: {
    //     type: Schema.ObjectId,
    //     required: true,
    //     ref: 'Item'
    // },
    Item_avatar: String,
    Client_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Client'
    },
}, {

    timestamps: true
});
const Order = model('Order', orderSchema)
module.exports = Order
