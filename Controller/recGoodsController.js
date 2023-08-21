
const Client = require('../Models/ClientModel');
const Item = require('../Models/ItemModel');
const Order = require('../Models/OrderModel');
const R_goods = require('../Models/Rec_goods_model');
const { _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/R_goodsValidator');
const { getQueryOrder } = require('./orderController');


exports.Create_R_goods = async (req, res) => {

  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----

  try {
    const oldOrder = await getQueryOrder({ _id: req.body.Order_id })
    if (!oldOrder) {
      return
    }


    // Save this Client to database ------->>

    const data = await R_goods.create(req.body);

    const resData = await R_goods.findById(data._id)
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])

    res.send(resData)
    // Save this Client to database <<-------

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};





exports.All_entry = async (req, res, next) => {
  try {
    const data = await R_goods.find({})
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])
      .sort({ 'Receive_date': -1 })
      .limit(50)
    res.status(200).json(data)
  } catch (e) {
    next(e)
  }
};

exports.recQuery = async (req, res, next) => {
  try {
    const recData = await R_goods.find(req.query)
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])
      .sort({ 'Receive_date': -1 })

    res.status(200).json(recData)
  } catch (e) {
    next(e)
  }
};

exports.Update_R_Goods = async (req, res) => {
  const filter = {
    _id: req.body._id
  }
  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----

  try {
    await R_goods.findOneAndUpdate(filter, req.body, { new: true });

    const data = await R_goods.findOne(filter)
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])
    res.send(data)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.DeleteR_goods = async (req, res) => {
  try {
    const data = await R_goods.deleteOne({ _id: req.body._id })
    res.sendStatus(200)
    console.log(data);

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



