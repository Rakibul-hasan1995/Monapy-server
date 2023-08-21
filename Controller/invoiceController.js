
const Client = require('../Models/ClientModel');
const Invoice = require('../Models/InvoiceModel');
const Order = require('../Models/OrderModel');
const { _arrToObjBy_id, _arrSummation } = require('../Utils/jsFunctions');
const moment = require('moment');

const validate = require('../Validators/Invoice_Validator');
const D_goods = require('../Models/Del_goods_model');
const { _printInvoice } = require('../Services/_printInvoice');
const { default: mongoose } = require('mongoose');

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
    const billNo = await Invoice.count({ Client_id: req.body.Client_id })
    const bodyData = {
      ...req.body,
      Client_bill_no: billNo + 1,
      Invoice_amount: req.body.Invoice_amount.toFixed()
    }

    let data = await Invoice.create(bodyData)

    // Change Status of Orders ------->>
    await Order.updateMany(
      { _id: { $in: data.Items } },
      { $set: { Order_status: 'Invoiced' } }
    );

    // generate response
    const inv = await getQueryInvoice({ _id: data._id })

    res.send(inv)

  } catch (e) {
    console.log(e);
    next(e)
  }
};



exports.getCount = async (req, res, next) => {
  try {
    const count = await Invoice.count({})

    res.status(200).json(count)
  } catch (error) {
    next(error)
  }
};

exports.getQuery = async (req, res, next) => {
  try {
    if (!Object.keys(req.query).length) {
      return res.status(400).json({ massage: 'Query Sting Not Valid' })
    }
    const data = await getQueryInvoice(req.query)
    res.send(data)
  } catch (error) {
    next(error)
  }
};




exports.All_invoice = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(moment().subtract(180, 'days'))
    const invoices = await Invoice.find({ Invoice_date: { $gte: thirtyDaysAgo } })
      .populate('Items')
      .populate({ path: 'Client_id', select: ['Client_name', 'Client_address'] })
      .exec();

    res.send(invoices)
  } catch (e) {
    console.log(e);
    next()
  }
};

exports.groupXy = async (_req, res, next) => {
  try {
    let data = await getInvoiceXY()
    res.status(200).json(data)
  } catch (e) {
    next(e)
  }
};


exports.generatePdf = async (req, res, next) => {
  console.log(req.query)
  try {
    let invoice = await getQueryInvoice(req.query)

    for (let i = 0; i < invoice.Items.length; i++) {
      const element = invoice.Items[i];
      let cNo = [];
      const o = await D_goods.find({ Order_id: element._id })
      o.forEach((e) => cNo.push(e.Delivery_ch_no))
      const withSpaces = cNo.join(", ");
      element.Delivery_ch_no = withSpaces;
    }
    let Items = invoice.Items.map((or) => {
      return {
        OrderAmount: or.Order_qty * or.Order_rate,
        ...or
      };
    });

    invoice.Items = Items
    _printInvoice(invoice, res)
  } catch (error) {
    console.log(error)
    next(error)
  }
};



const getQueryInvoice = exports.getQueryOrder = async (query) => {

  const queryParams = query
  if (!query) {

    return []
  }
  let matchStage = {};
  if (queryParams.Client_id) {
    matchStage.Client_id = mongoose.Types.ObjectId(queryParams.Client_id);
  }
  if (queryParams.Order_no) {
    matchStage.Order_no = queryParams.Order_no
  }
  if (queryParams.Order_status) {
    matchStage.Order_status = queryParams.Order_status
  }
  if (queryParams._id) {
    matchStage._id = mongoose.Types.ObjectId(queryParams._id);
  }
  if (!Object.keys(query).length) {
    return []
  }
  try {
    const data = await Invoice.aggregate([
      {
        $match: matchStage
      },
      {
        $lookup: {
          from: 'clients', // The name of the "Client" collection in the database
          localField: 'Client_id',
          foreignField: '_id',
          as: 'clientInfo',
        },
      },
      {
        $lookup: {
          from: 'orders', // The name of the "Order" collection in the database
          localField: 'Items',
          foreignField: '_id',
          as: 'Items',
        },
      },
      {
        $addFields: {
          Client_name: { $first: '$clientInfo.Client_name' },
          Client_address: { $first: '$clientInfo.Client_address' },
          image: { $first: "$Items.Item_avatar" }
        },
      },
      { $unset: ["clientInfo", 'updatedAt', '__v'] },

    ])
    if (queryParams._id) {
      if (data.length == 1) {
        return data[0]
      }
    }
    return data
  } catch (e) {
    return e
  }
}

const getInvoiceXY = exports.getInvoiceXY = async () => {
  try {
    let data = await Invoice.aggregate(
      [
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$Invoice_date' } },
            y: { $sum: '$Invoice_amount' }
          }
        },
        { $sort: { _id: 1 } },
      ],
    );
    data = data.map(item => {
      return {
        x: item._id,
        y: item.y
      };
    });
    return data
  } catch (error) {
    throw new Error(error)
  }
}









