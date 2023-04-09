
const Order = require('../Models/OrderModel');
const R_goods = require('../Models/Rec_goods_model');
const D_goods = require('../Models/Del_goods_model');
const Production = require('../Models/ProductionModel');
const Item = require('../Models/ItemModel');
const Client = require('../Models/ClientModel');
const validate = require('../Validators/order_validator');
const { _arrSummation, _arrToObjBy_id, _randomString } = require('../Utils/jsFunctions');
const cloudinary = require('../Utils/cloudinary');


exports.clone_Order = async (req, res, next) => {
  try {
    const data = await Order.findOne({ _id: req.query._id })
    const client = await Client.findOne({ _id: data.Client_id })
    const orders = await Order.find({ Client_id: client._id })
    const count = await Order.count({})
    let obj = {
      Order_no: `#${count + 1} ${sliceOrderNo(data.Order_no)}`,
      Order_date: new Date(),
      Order_qty: 1,
      stitch: data.stitch,
      Order_rate: data.Order_rate,
      Order_sl: orders.length + 1,
      Client_id: data.Client_id,
      Item_avatar: data.Item_avatar

    }
    let nData = await Order.create(obj)
    let xData = {
      _id: nData._id,
      Order_no: nData.Order_no,
      Order_date: nData.Order_date,
      OrderAmount: nData.Order_qty * nData.Order_rate,
      Order_qty: nData.Order_qty,
      Order_rate: nData.Order_rate,
      Order_sl: nData.Order_sl,
      ProductionQty: nData.ProductionQty,
      Order_status: nData.Order_status,
      Client_id: nData.Client_id,
      clientName: client['Client_name'],
      Item_avatar: nData.Item_avatar,
    }
    console.log(xData);
    res.send(xData)
  } catch (error) {
    next(error)
  }

};

const sliceOrderNo = (text) => {
  const string = text.substring('', 4);
  if (string.includes('#')) {
    return text.substring(4)
  } else {
    return text
  }
}



exports.uploadImage = async (req, res, next) => {

  // check file
  if (!req.file) {
    return res.status(400).json({ file: 'file not found' })
  }

  try {
    const image = await cloudinary.uploader.upload(req.file.path)
    const design = image.secure_url
    res.send(design)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};

exports.Create_Order = async (req, res, next) => {
  // check file
  if (!req.file) {
    return res.status(400).json({ file: 'file not found' })
  }
  const { Order_no, Order_date, Order_qty, Order_rate, stitch, Order_sl, Order_description, Client_id } = req.body
  let obj = {
    Order_no,
    Order_date,
    Order_qty,
    Order_rate,
    stitch,
    Order_sl,
    Order_description,
    Client_id,
    // Item_avatar: req.file.link
  }



  //--->> Check All Input value are valid---->>
  const Validator = validate(obj)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }

  //check exist order no
  const found = await Order.findOne({ Order_no })
  if (found) {
    return res.status(400).json({ Order_no: `${Order_no} is Not Valid` })
  }

  //--->> Check All Input value are valid <<----
  try {
    const image = await cloudinary.uploader.upload(req.file.path)
    const count = await Order.count({})

    obj = {
      ...obj,
      Order_no: `#${count + 1} ${obj.Order_no}`,
      Item_avatar: image.secure_url
    }
    // Save this Order to database ------->>
    let data = await Order.create(obj)
    const client = await Client.findOne({ _id: data.Client_id })

    let xData = {
      _id: data._id,
      Order_no: data.Order_no,
      Order_date: data.Order_date,
      OrderAmount: data.Order_qty * data.Order_rate,
      Order_qty: data.Order_qty,
      Order_rate: data.Order_rate,
      Order_sl: data.Order_sl,
      ProductionQty: data.ProductionQty,
      Order_status: data.Order_status,
      Client_id: data.Client_id,
      clientName: client['Client_name'],
      Item_avatar: data.Item_avatar,
    }
    res.send(xData)
    // Save this Order to database <<-------

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.All_Order = async (req, res) => {
  try {
    let order = await Order.find({ Order_status: { $nin: ['Reject'] } })
    let value = await modifyData(order)
    res.send(value)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.orderQuery = async (req, res) => {
  try {
    const order = _arrToObjBy_id(await Order.find(req.query))
    const client = _arrToObjBy_id(await Client.find({}))

    for (let i = 0; i < Object.values(order).length; i++) {
      const _id = Object.values(order)[i]._id
      const x = order[_id]
      order[_id] = {
        _id,
        Order_no: x.Order_no,
        stitch: x.stitch,
        Order_date: x.Order_date,
        OrderAmount: x.Order_qty * x.Order_rate,
        Order_qty: x.Order_qty,
        Order_rate: x.Order_rate,
        Order_sl: x.Order_sl,
        ProductionQty: x.ProductionQty,
        Order_status: x.Order_status,
        Client_id: x.Client_id,
        clientName: client[x.Client_id]['Client_name'],
        Item_avatar: x.Item_avatar,
      }
    }
    res.send(order)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }

};


exports.Update_Order = async (req, res) => {
  const filter = {
    _id: req.body._id
  }
  const { Order_no, Order_qty, Order_rate, Order_status, stitch, ProductionQty } = req.body
  let update = {
    Order_no, Order_qty, Order_rate, Order_status, stitch, ProductionQty
  }
  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----
  try {
    let order = await Order.findOneAndUpdate(filter, update, { new: true });
    res.send(order)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.getOrderDetailsById = async (req, res, next) => {
  const filter = {
    _id: req.query._id
  }
  let obj = {}

  try {
    // Get Order Information ----->
    const order = await Order.findOne(filter);
    if (!order) {
      return next()
    }
    // Get Order Information <-----<


    // Generate Production Qty ----->
    const production = await Production.find({ "Production_data.Order_id": filter._id })
    let proData = []
    let productionQty = 0
    if (production) {
      for (let i = 0; i < production.length; i++) {
        const element = production[i]['Production_data'];
        let data = Object.values(element)
        for (let index = 0; index < data.length; index++) {
          const e = data[index];
          if (e.Order_id == filter._id) {
            proData.push(e)
          }
        }
      }

      productionQty = _arrSummation(proData, 'qty')
    }
    // Generate Production Qty <-----


    // Generate Received Qty ----->>
    const R_Goods = await R_goods.find({ Order_id: filter._id })

    // Generate Received Qty <<-------


    // Generate Delivery Qty ----->>
    const d_Goods = await D_goods.find({ Order_id: filter._id })

    // Generate Delivery Qty <<-------

    // Get Item Img Url ----->>
    const item = await Item.findOne({ _id: order.Item_id })
    // Get Item Img Url <<-------

    // Get Client Data ----->>
    const client = await Client.findOne({ _id: order.Client_id })
    // Get Client Data <<-------




    obj = {
      productionQty,
      Receive_qty: _arrSummation(R_Goods, 'Receive_qty'),
      Delivery_qty: _arrSummation(d_Goods, 'Delivery_qty'),
      Item_avatar: order.Item_avatar,
      Client_name: client.Client_name
    }

    res.send(obj)
  } catch (e) {
    next(e)
  }
};


const modifyData = async (data) => {
  data = data.map((x) => {
    return {
      _id: x._id,
      Order_no: x.Order_no,
      stitch: x.stitch,
      Order_date: x.Order_date,
      OrderAmount: x.Order_qty * x.Order_rate,
      Order_qty: x.Order_qty,
      Order_rate: x.Order_rate,
      Order_sl: x.Order_sl,
      ProductionQty: x.ProductionQty,
      Order_status: x.Order_status,
      Client_id: x.Client_id,
      Item_avatar: x.Item_avatar,
    };
  });
  return _arrToObjBy_id(data)

}

