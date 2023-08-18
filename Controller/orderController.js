
const Order = require('../Models/OrderModel');
const R_goods = require('../Models/Rec_goods_model');
const D_goods = require('../Models/Del_goods_model');
const Production = require('../Models/ProductionModel');
const Item = require('../Models/ItemModel');
const Client = require('../Models/ClientModel');
const validate = require('../Validators/order_validator');
const { _arrSummation, _arrToObjBy_id, _randomString } = require('../Utils/jsFunctions');
const cloudinary = require('../Utils/cloudinary');
const { ObjectId, default: mongoose, Mongoose } = require('mongoose');
const Invoice = require('../Models/InvoiceModel');






exports.clone_Order = async (req, res, next) => {
  try {
    const data = await Order.findOne({ _id: req.query._id })
    if (!data) {
      return res.status(400).json({ message: 'data not found' })
    }
    const client = await Client.findOne({ _id: data.Client_id })
    const orders = await Order.find({ Client_id: client._id })
    const count = await Order.count({})


    let obj = {
      Order_no: removeSpace(`#${count + 1} ${sliceOrderNo(data.Order_no)}`),
      Order_date: new Date(),
      Order_qty: 1,
      stitch: data.stitch,
      Order_rate: data.Order_rate,
      Order_sl: orders.length + 1,
      Client_id: data.Client_id,
      Item_avatar: data.Item_avatar
    }
    let nData = await Order.create(obj)
    const resData = await getQueryOrder({ _id: nData._id })
    res.send(resData)
  } catch (error) {
    next(error)
  }

};


const removeSpace = (str) => {
  return str.replace(/\s+/g, ' ');
}

const sliceOrderNo = (text, length = 4) => {
  const string = text.substring('', length);
  if (string.includes('#')) {
    return text.substring(length)
  } else {
    return text
  }
}



// Delete an order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const _id = req.params._id;

    const order = await getQueryOrder({ _id })

    if (!order) {
      return res.status(404).json({ message: 'Order Not Found' });
    }

    if (order.Order_status == 'Sub-Contact') {
      return res.status(404).json({ message: 'Sub-Contact" Item Not Deletable' });
    }
    if (order.Order_status == 'Invoiced') {
      return res.status(404).json({ message: '"Invoiced" Item Not Deletable' });
    }
    if (order.Order_status == 'Complete') {
      return res.status(404).json({ message: 'Complete" Item Not Deletable' });
    }

    if (order.deliveredQty > 0) {
      return res.status(404).json({ message: 'Already Delivered This Item' });
    }
    if (order.ProductionQty > 0) {
      return res.status(404).json({ message: 'Already Production This Item' });
    }
    const deletedOrder = await Order.findByIdAndDelete(_id);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
  const { Order_no, Order_date, Order_qty, Order_rate, stitch, Order_description, Client_id } = req.body

  let obj = {
    Order_no,
    Order_date,
    Order_qty,
    Order_rate,
    stitch,
    Order_description,
    Client_id,
  }


  //--->> Check All Input value are valid---->>
  const Validator = validate(obj)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }

  const Order_slCount = await Order.countDocuments({ Client_id: mongoose.Types.ObjectId(Client_id) });

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
      Order_sl: Order_slCount + 1,
      Order_no: `#${count + 1} ${obj.Order_no}`,
      Item_avatar: image.secure_url
    }
    // Save this Order to database ------->>
    let data = await Order.create(obj)
    const resData = await getQueryOrder({ _id: data._id })

    res.send(resData)
    // Save this Order to database <<-------

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.getRunningOrder = async (req, res) => {
  try {
    const data = await getQueryOrder({
      Order_status: {
        $nin: ['Reject', 'Invoiced']
      }
    })
    res.send(data)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.orderQuery = async (req, res, next) => {
  try {
    if (!Object.keys(req.query).length) {
      return res.status(400).json({ massage: 'Query Sting Not Valid' })
    }
    const data = await getQueryOrder(req.query)
    res.send(data)
  } catch (error) {
    next(error)
  }

};

exports.Update_Order = async (req, res) => {
  const filter = {
    _id: req.body._id
  }
  const { Order_no, Order_qty, Order_rate, Order_status, stitch, ProductionQty, Item_avatar } = req.body
  let update = {
    Order_no, Order_qty, Order_rate, Order_status, stitch, ProductionQty, Item_avatar
  }
  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----
  try {
    let order = await Order.findOneAndUpdate(filter, update, { new: true });
    if (order.Order_status === 'Invoiced') {
      await updateInvoiceAmount(order._id)
    }
    res.send(order)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


const getQueryOrder = exports.getQueryOrder = async (query) => {

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
    const data = await Order.aggregate([
      {
        $lookup: {
          from: 'd_goods', // Specify the name of the delivery collection
          localField: '_id',
          foreignField: 'Order_id',
          as: 'deliveries',
        },
      },
      {
        $lookup: {
          from: 'r_goods', // Specify the name of the delivery collection
          localField: '_id',
          foreignField: 'Order_id',
          as: 'rec',
        },
      },
      {
        $lookup: {
          from: 'clients', // Specify the name of the client collection
          localField: 'Client_id',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $addFields: {
          deliveredQty: {
            $sum: '$deliveries.Delivery_qty',
          },
          receivedQty: {
            $sum: '$rec.Receive_qty',
          },
          Client_name: { $first: '$client.Client_name' },
        },
      },
      {
        $match: matchStage
      },
      { $unset: ["deliveries", 'client', 'rec', '__v', 'createdAt', 'updatedAt'] },
      // { $sort: { Order_date: -1 } }

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




const updateInvoiceAmount = exports.updateInvoiceAmount = async (_id) => {
  try {
    const invoice = await Invoice.findOne({ Items:_id })
      .populate('Items')
      .populate({ path: 'Client_id', select: ['Client_name', 'Client_address'] })
      .exec();

    if (!invoice) {
      return null
    }
    let Items = invoice.Items.map((or) => {
      return {
        OrderAmount: or.Order_qty * or.Order_rate,
      };
    });

    const itemAmount = _arrSummation(Items, 'OrderAmount')

    if (invoice.Discount) {
      const discountAmount = getDiscount(itemAmount, invoice.Discount)
      const newInvoiceAmount = itemAmount - discountAmount
      return await Invoice.updateOne({ _id: invoice._id }, { $set: { Invoice_amount: newInvoiceAmount } });
    } else {
      return await Invoice.updateOne({ _id: invoice._id }, { $set: { Invoice_amount: itemAmount } });
    }
  } catch (error) {
    console.log(error)
  }
}

const getDiscount = (amm, dis) => {
  const res = Number(amm) / 100 * Number(dis)
  return res.toFixed(2)
}
