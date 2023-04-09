
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
    const order = _arrToObjBy_id(await Order.find({}))
    const client = _arrToObjBy_id(await Client.find({}))

    // Save this Client to database ------->>

    let data = await D_goods.create(req.body)

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

exports.All_entry = async (req, res) => {
  try {
    const dGoods = _arrToObjBy_id(await D_goods.find({}))
    await getGetModifyDelivery(dGoods)
    res.send(dGoods)

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.GetDataByOrder = async (req, res) => {
  const filter = {
    Order_id: req.query.Order_id
  }
  try {
    const dGoods = _arrToObjBy_id(await D_goods.find(filter))
    await getGetModifyDelivery(dGoods)
    res.send(dGoods)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
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
    const order = _arrToObjBy_id(await Order.find({}))
    const client = _arrToObjBy_id(await Client.find({}))

    let data = await D_goods.findOneAndUpdate(filter, req.body, { new: true });
    data = {
      ...req.body,
      _id: data._id,
      Order_no: order[data.Order_id]['Order_no'],
      Design: order[data.Order_id]['Item_avatar'],
      Client_name: client[data['Client_id']].Client_name,
    }
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
    console.log(data);

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


const getGetModifyDelivery = async (dGoods) => {
  const order = _arrToObjBy_id(await Order.find({}))
  const client = _arrToObjBy_id(await Client.find({}))
  for (let i = 0; i < Object.values(dGoods).length; i++) {
    const _id = Object.values(dGoods)[i]._id
    const data = dGoods[_id]
    dGoods[_id] = {
      _id,
      Delivery_date: data['Delivery_date'],
      Delivery_ch_no: data['Delivery_ch_no'],
      Delivery_qty: data['Delivery_qty'],
      Client_name: client[data['Client_id']].Client_name,
      Client_id: data['Client_id'],
      Order_no: order[data.Order_id]['Order_no'],
      Order_id: data.Order_id,
      Design: order[data.Order_id]['Item_avatar'],
    }
  }
  return dGoods
}



