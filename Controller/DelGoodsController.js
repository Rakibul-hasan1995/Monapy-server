
const Client = require('../Models/ClientModel');
const D_goods = require('../Models/Del_goods_model');
const Item = require('../Models/ItemModel');
const Order = require('../Models/OrderModel');
const { _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/D_goodsValidator');




// exports.Create = async (req, res) => {

//   //--->> Check All Input value are valid---->>
//   const Validator = validate(req.body)
//   if (!Validator.isValid) {
//     return res.status(400).json(Validator.error)
//   }
//   //--->> Check All Input value are valid <<----

//   try {
//     // Save this Client to database ------->>
//     let data = {}
//     const dGoods = _arrToObjBy_id(await D_goods.create(req.body))
//     data = {
//       [dGoods._id]: dGoods
//     }
//     await getGetModifyDelivery(data)
//     res.send(data)
//     // Save this Client to database <<-------

//   } catch (e) {
//     console.log(e);
//     res.sendStatus(500)
//   }
// };
exports.Create = async (req, res) => {

  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----

  try {
    // Save this Client to database ------->>

    let data = await D_goods.create(req.body)
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])


    res.send(data)
    // Save this Client to database <<-------

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.All_entry = async (req, res, next) => {
  try {
    const paymentData = await D_goods.find({})
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])
      .sort({ 'Delivery_date': -1, "Delivery_ch_no": -1 })
      .limit(50)
    res.status(200).json(paymentData)
  } catch (e) {
    next(e)
  }
};

exports.delQuery = async (req, res, next) => {
  try {
    const recData = await D_goods.find(req.query)
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])
      .sort({ 'Delivery_date': -1, "Delivery_ch_no": -1 })

    res.status(200).json(recData)
  } catch (e) {
    next(e)
  }
};



exports.Update = async (req, res) => {
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
    let data = await D_goods.findOneAndUpdate(filter, req.body, { new: true })
      .populate('Client_id', 'Client_name')
      .populate('Order_id', ['Order_no', 'Item_avatar'])

    res.send(data)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.Delete = async (req, res) => {
  try {
    const data = await D_goods.deleteOne({ _id: req.body._id })
    res.sendStatus(200)

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};




