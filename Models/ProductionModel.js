const { Schema, model } = require('mongoose')

const ProductionSchema = new Schema({
    Production_date: Date,
    Production_shift: String,
    Production_amount: Number,
    Production_data: [{
        Line_no: String, 
        Order_no: String,
        Order_id: {
            type: Schema.ObjectId,
            ref: 'Order',
            required: true,
        },
        Client_name: String,
        Item_unit: String,
        Item_avatar: String,
        Order_rate: Number,
        qty: Number,
        amount: Number,
        remarks: String,
        operator: String,
        Item_stitch: String
    }],
}, {
    timestamps: true
});


const Production = model('Production', ProductionSchema)

module.exports = Production

