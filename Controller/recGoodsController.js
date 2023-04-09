
const Client = require('../Models/ClientModel');
const Item = require('../Models/ItemModel');
const Order = require('../Models/OrderModel');
const R_goods = require('../Models/Rec_goods_model');
const { _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/R_goodsValidator');


exports.Create_R_goods = async (req, res) => {

  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----

  try {
    const order = _arrToObjBy_id(await Order.find({}))
    const client = _arrToObjBy_id(await Client.find({}))

    // Save this Client to database ------->>

    let data = await R_goods.create(req.body)

    data = {
      ...req.body,
      _id: data._id,
      Order_no: order[data.Order_id]['Order_no'],
      Design: order[data.Order_id]['Item_avatar'],
      Client_name: client[data['Client_id']].Client_name,
    }

    res.send(data)
    // Save this Client to database <<-------

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};





// exports.Create_R_goods = async (req, res) => {

//   //--->> Check All Input value are valid---->>
//   const Validator = validate(req.body)
//   if (!Validator.isValid) {
//     return res.status(400).json(Validator.error)
//   }
//   //--->> Check All Input value are valid <<----

//   try {
//     // Save this Client to database ------->>
//     const data = await R_goods.create(req.body)
//     res.send(data)
//     // Save this Client to database <<-------

//   } catch (e) {
//     console.log(e);
//     res.sendStatus(500)
//   }
// };

exports.All_entry = async (req, res) => {
  try {
    const rGoods = _arrToObjBy_id(await R_goods.find({}))
    const order = _arrToObjBy_id(await Order.find({}))
    const client = _arrToObjBy_id(await Client.find({}))

    for (let i = 0; i < Object.values(rGoods).length; i++) {
      const _id = Object.values(rGoods)[i]._id
      const data = rGoods[_id]
      rGoods[_id] = {
        _id,
        Receive_date: data['Receive_date'],
        Receive_ch_no: data['Receive_ch_no'],
        Receive_qty: data['Receive_qty'],
        Client_name: client[data['Client_id']].Client_name,
        Order_no: order[data.Order_id]['Order_no'] || 'Order_no',
        Order_id: data.Order_id,
        Design: order[data.Order_id]['Item_avatar'],
      }
    }
    res.send(rGoods)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};
exports.orderQuery = async (req, res) => {
  try {
    const rGoods = _arrToObjBy_id(await R_goods.find(req.query))
    const order = _arrToObjBy_id(await Order.find({}))
    const item = _arrToObjBy_id(await Item.find({}))
    const client = _arrToObjBy_id(await Client.find({}))

    for (let i = 0; i < Object.values(rGoods).length; i++) {
      const _id = Object.values(rGoods)[i]._id
      const data = rGoods[_id]
      rGoods[_id] = {
        _id,
        Receive_date: data['Receive_date'],
        Receive_ch_no: data['Receive_ch_no'],
        Receive_qty: data['Receive_qty'],
        Client_name: client[data['Client_id']].Client_name,
        Order_no: order[data.Order_id]['Order_no'],
        Order_id: data.Order_id,
        Design: order[data.Order_id]['Item_avatar'],
      }
    }
    res.send(rGoods)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
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
    let data = await R_goods.findOneAndUpdate(filter, req.body, { new: true });
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

