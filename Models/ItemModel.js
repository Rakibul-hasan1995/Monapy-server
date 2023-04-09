
const { Schema, model } = require('mongoose')

const itemSchema = new Schema({
    Item_name: String,
    Item_type: String,
    Item_avatar: String,
    Item_description: String,
    Item_unit: String,
    Item_stitch: String,

}, {
    timestamps: true
});


const Item = model('Item', itemSchema)

module.exports = Item










