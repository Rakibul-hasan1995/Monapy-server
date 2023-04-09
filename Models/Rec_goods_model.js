const { Schema, model } = require('mongoose')

const Rec_goodsSchema = new Schema({
    Receive_date: Date,
    Receive_ch_no: String,
    Client_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Client'
    },
    Order_id: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Order'
    },
    Receive_qty: Number,
    Carrier_name: String,

}, {
    timestamps: true
});

const R_goods = model('R_goods', Rec_goodsSchema)

module.exports = R_goods

