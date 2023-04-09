const { Schema, model } = require('mongoose')

const Del_goodsSchema = new Schema({
    Delivery_date: Date,
    Delivery_ch_no: String,
    Client_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Client'
    },
    Client_name: String,
    Order_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Order'
    },
    Delivery_qty: Number,
    Carrier_name: String,

}, {
    timestamps: true
});


const D_goods = model('D_goods', Del_goodsSchema)

module.exports = D_goods