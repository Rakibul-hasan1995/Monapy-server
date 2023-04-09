
const Client = require('../Models/ClientModel');
const Invoice = require('../Models/InvoiceModel');
const Item = require('../Models/ItemModel');
const Order = require('../Models/OrderModel');
const { _arrToObjBy_id, _arrSummation } = require('../Utils/jsFunctions');
const Pdfmake = require('pdfmake');

const validate = require('../Validators/Invoice_Validator');
const D_goods = require('../Models/Del_goods_model');
const { _printInvoice } = require('../Services/_printInvoice');

exports.Create_Invoice = async (req, res, next) => {

  // Check This Invoice is already create ? ---->>
  const existItem = await Invoice.findOne({ Invoice_no: req.body.Invoice_no })
  if (existItem) {
    return res.status(400).json({ 'Invoice_no': `(${req.body.Invoice_no})  already exist` })
  }
  // Check This item is already create ? <<----

  // Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  // Check All Input value are valid <<----



  try {
    // Save this item to database ------->>
    const bodyData = {
      ...req.body,
      Invoice_amount: req.body.Invoice_amount.toFixed()
    }
    let data = await Invoice.create(bodyData)

    // Change Status of Orders ------->>
    data.Items.forEach(async (el) => {
      const or = await Order.findOneAndUpdate({ _id: el }, { Order_status: 'Invoiced' }, { new: true })
      console.log(or);
    })


    // generate response
    const order = _arrToObjBy_id(await Order.find({}))
    const client = _arrToObjBy_id(await Client.find({}))


    data.Items.map((order_id) => {
      let x = order[order_id]
      return {
        Order_no: x.Order_no,
        Order_date: x.Order_date,
        OrderAmount: x.Order_qty * x.Order_rate,
        Order_qty: x.Order_qty,
        Order_rate: x.Order_rate,
        Order_sl: x.Order_sl,
        design: x['Item_avatar'],
      }
    })

    data = {
      _id: data._id,
      Invoice_date: data['Invoice_date'],
      Invoice_no: data['Invoice_no'],
      Client_bill_no: data['Client_bill_no'],
      Client_name: client[data['Client_id']].Client_name,
      Client_id: data['Client_id'],
      Client_address: client[data['Client_id']].Client_address,
      Invoice_amount: _arrSummation(data.Items, 'OrderAmount'),
      // Invoice_amount: data['Invoice_amount'],
      Discount: data['Discount'],
      Status: data['Status'],
      item: data.Items,
    }

    res.send(data)
    // Save this item to database <<-------

  } catch (e) {
    console.log(e);
    // res.sendStatus(500)
    next(e)
  }
};



exports.getQuery = async (req, res) => {
  try {
    const invoice = _arrToObjBy_id(await Invoice.find(req.query))
    const order = _arrToObjBy_id(await Order.find({}))
    const client = _arrToObjBy_id(await Client.find({}))
    for (let i = 0; i < Object.values(invoice).length; i++) {
      const _id = Object.values(invoice)[i]._id
      const data = invoice[_id]
      let Item = []
      Object.values(data['Items']).forEach(element => {
        let x = order[element]
        x = {
          Order_no: x.Order_no,
          Order_date: x.Order_date,
          OrderAmount: x.Order_qty * x.Order_rate,
          Order_qty: x.Order_qty,
          Order_rate: x.Order_rate,
          Order_sl: x.Order_sl,
          design: x['Item_avatar'],
        }
        Item.push(x)
      });
      invoice[_id] = {
        _id,
        Invoice_date: data['Invoice_date'],
        Invoice_no: data['Invoice_no'],
        Client_bill_no: data['Client_bill_no'],
        Client_name: client[data['Client_id']].Client_name,
        Client_id: data['Client_id'],
        Client_address: client[data['Client_id']].Client_address,
        Invoice_amount: getParentage(_arrSummation(Item, 'OrderAmount'), data['Discount']),
        Discount: data['Discount'],
        Status: data['Status'],
        item: Item,
        design: Item[0]['design']
      }
      // console.log(invoice);
    }
    res.send(invoice)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.groupByDay = async (req, res, next) => {
  try {
    const invoice = _arrToObjBy_id(await Invoice.find())
    const order = _arrToObjBy_id(await Order.find({}))

    for (let i = 0; i < Object.values(invoice).length; i++) {
      const _id = Object.values(invoice)[i]._id
      const data = invoice[_id]
      let Item = []
      Object.values(data['Items']).forEach(element => {
        let x = order[element]
        x = {
          OrderAmount: x.Order_qty * x.Order_rate,
        }
        Item.push(x)
      });
      invoice[_id] = {
        x: data['Invoice_date'],
        y: getParentage(_arrSummation(Item, 'OrderAmount'), data['Discount'])
        // y: Number(getParentage(_arrSummation(Item, 'OrderAmount'), data['Discount'])).toFixed(2)
      }
    }
    res.send(Object.values(invoice))
  } catch (e) {
    next(e)
  }
};
exports.groupXy = async (req, res, next) => {
  try {
    const invoice = _arrToObjBy_id(await Invoice.find())
    const order = _arrToObjBy_id(await Order.find({}))

    for (let i = 0; i < Object.values(invoice).length; i++) {
      const _id = Object.values(invoice)[i]._id
      const data = invoice[_id]
      let Item = []
      Object.values(data['Items']).forEach(element => {
        let x = order[element]
        x = {
          OrderAmount: x.Order_qty * x.Order_rate,
        }
        Item.push(x)
      });
      invoice[_id] = {
        x: data['Invoice_date'],
        y: getParentage(_arrSummation(Item, 'OrderAmount'), data['Discount']),
        Client_id: data.Client_id
        // y: Number(getParentage(_arrSummation(Item, 'OrderAmount'), data['Discount'])).toFixed(2)
      }
    }
    res.send(Object.values(invoice))
  } catch (e) {
    next(e)
  }
};



const getParentage = (amm, discount) => {
  let y = (amm / 100) * discount
  let res = parseInt(amm) - parseInt(y)
  return res
}



exports.All_invoice = async (req, res) => {
  try {
    const invoice = _arrToObjBy_id(await Invoice.find({}))
    const order = _arrToObjBy_id(await Order.find({}))
    const client = _arrToObjBy_id(await Client.find({}))

    for (let i = 0; i < Object.values(invoice).length; i++) {
      const _id = Object.values(invoice)[i]._id
      const data = invoice[_id]
      let Item = []
      Object.values(data['Items']).forEach(element => {
        let x = order[element]
        x = {
          Order_id: element,
          Order_no: x.Order_no,
          Order_date: x.Order_date,
          OrderAmount: x.Order_qty * x.Order_rate,
          Order_qty: x.Order_qty,
          Order_rate: x.Order_rate,
          Order_sl: x.Order_sl,
          design: x['Item_avatar'],
        }
        Item.push(x)
      });
      invoice[_id] = {
        _id,
        Invoice_date: data['Invoice_date'],
        Invoice_no: data['Invoice_no'],
        Client_bill_no: data['Client_bill_no'],
        Client_name: client[data['Client_id']].Client_name,
        Client_id: data['Client_id'],
        Client_address: client[data['Client_id']].Client_address,
        Invoice_amount: getParentage(_arrSummation(Item, 'OrderAmount'), data['Discount']),
        Discount: data['Discount'],
        Status: data['Status'],
        item: Item,
        design: Item[0]['design']
      }
    }
    res.send(invoice)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.Update_invoice = async (req, res) => {
  const filter = {
    _id: req.body._id
  }
  const update = {
    // Item_name: req.body.Item_name,
    // Item_type: req.body.Item_type,
    // Item_avatar: req.body.Item_avatar,
    // Item_description: req.body.Item_description,
    // Item_unit: req.body.Item_unit,
    // Item_stitch: req.body.Item_stitch,
  }
  try {
    let data = await Invoice.findOneAndUpdate(filter, update, { new: true });
    res.send(data)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.Delete_invoice = async (req, res) => {
  try {
    const data = await Invoice.deleteOne({ _id: req.body._id })
    res.sendStatus(200)
    console.log(data);

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};





exports.generatePdf = async (req, res, next) => {

  try {
    let invoice = await Invoice.findOne(req.query)
    const inv = invoice
    const order = _arrToObjBy_id(await Order.find({}))
    const client = await Client.findOne({ _id: inv.Client_id })
    let arr = inv['Items']
    let Item = arr.map((or_id) => {
      let x = order[or_id]
      return {
        Order_id: or_id,
        Order_no: x.Order_no,
        Order_date: x.Order_date,
        OrderAmount: x.Order_qty * x.Order_rate,
        Order_qty: x.Order_qty,
        Order_rate: x.Order_rate,
        Order_sl: x.Order_sl,
        design: x['Item_avatar'],
      };
    });

    for (let i = 0; i < Item.length; i++) {
      const element = Item[i];
      let cNo = [];
      const o = await D_goods.find({ Order_id: element.Order_id })
      o.forEach((e) => cNo.push(e.Delivery_ch_no))
      const withSpaces = cNo.join(", ");
      element.Delivery_ch_no = withSpaces;
    }
    const newInvoice = {
      _id: inv['_id'],
      Invoice_date: inv['Invoice_date'],
      Invoice_no: inv['Invoice_no'],
      Client_bill_no: inv['Client_bill_no'],
      Client_name: client.Client_name,
      Client_id: inv['Client_id'],
      Client_address: client.Client_address,
      Invoice_amount: getParentage(_arrSummation(Item, 'OrderAmount'), inv['Discount']),
      Discount: inv['Discount'],
      Status: inv['Status'],
      item: Item,
      design: Item[0]['design']
    }
    _printInvoice(newInvoice, res)
  } catch (error) {
    console.log(' error in  invoice controller', error)
    res.json('error')
    // next(error)
  }
};



const xyz = async () => {
  Invoice.find(function (err, user) {

    user.forEach(async function (st) {
      console.log(st.Invoice_date);
      // let num = st.Invoice_amount.toFixed();

      // try {
      //   await Invoice.updateOne({ _id: st._id }, { Invoice_amount: num })
      //   console.log(num)
      // } catch (error) {
      //   console.log(error)
      // }


    })
  })
}


// xyz()
