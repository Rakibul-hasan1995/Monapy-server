
const moment = require('moment');
const Client = require('../Models/ClientModel');
const Invoice = require('../Models/InvoiceModel');
const Order = require('../Models/OrderModel');
const Payment = require('../Models/paymentModel');
const { _arrSummation, _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/client_validator');
const { Types, default: mongoose } = require('mongoose');
const { stateMentPdf, _printStateMent } = require('../Services/printStatement');


exports.Create_client = async (req, res, next) => {

  //--->> Check This Client is already create ? ---->>
  const existClient = await Client.findOne({ Client_name: req.body.Client_name })
  if (existClient) {
    return res.status(400).json({ 'Client_name': `(${req.body.Client_name})  already exist` })
  }
  //--->> Check This Client is already create ? <<----

  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----

  try {
    // Save this Client to database ------->>
    const client = await Client.create(req.body)

    res.status(200).json(client)

  } catch (e) {
    next(2)
  }
};



exports.All_client = async (req, res, next) => {

  try {
    const clients = await Client.aggregate([
      {
        $lookup: {
          from: 'invoices',
          localField: '_id',
          foreignField: 'Client_id',
          as: 'invoices'
        }
      },
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: 'Client_id',
          as: 'payments'
        }
      },
      {
        $addFields: {
          billAmount: {
            $sum: '$invoices.Invoice_amount',
          },
          paymentAmount: {
            $sum: '$payments.Receive_amount',
          }
        },
      },
      { $unset: ['payments', 'invoices'] },
      { $sort: { paymentAmount: -1 } }
    ])
    res.status(200).json(clients)

  } catch (error) {
    next(error)
  }
}

exports.getTopClients = async (_req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(moment().subtract(30, 'days'))
    const orders = await Order.find({ Order_date: { $gte: thirtyDaysAgo } })

    const customOrder = orders.map((item) => {
      return {
        _id: item._id,
        amount: item.Order_qty * item.Order_rate,
        Client_id: item.Client_id,
      };
    });
    const grouped = customOrder.reduce((acc, obj) => {
      const key = obj.Client_id;
      if (!acc[key]) {
        acc[key] = { amount: 0, Client_id: key };
      }
      acc[key].amount += obj.amount;
      return acc;
    }, {});
    const clients = _arrToObjBy_id(await Client.find({}))
    const data = Object.values(grouped).map((item) => {
      return {
        ...item,
        Client_name: clients[item.Client_id]?.Client_name
      }
    })
    res.status(200).json(data)
  } catch (error) {
    next(error)
  }
}


exports.Update_Client = async (req, res) => {
  const filter = {
    _id: req.body._id
  }
  const update = {
    Client_name: req.body.Client_name,
    Client_phone: req.body.Client_phone,
    Client_address: req.body.Client_address,
    Client_email: req.body.Client_email,
  }

  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----

  try {
    let client = await Client.findOneAndUpdate(filter, update, { new: true });
    res.send(client)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.Delete_Client = async (req, res) => {
  try {
    const client = await Client.deleteOne({ _id: req.body._id })
    res.sendStatus(200)
    console.log(client);

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};




const getStatement = exports.getStatement = async (req, res, next) => {
  try {
    const _id = req.params._id;
    const data = await generateStatement(_id)
    if (!data) {
      res.status(404).json({ "message": 'Data Not Found' })
    }
    res.status(200).json(data)
  } catch (error) {
    next(error)
    console.log(error)
  }
}



const generateStatement = exports.generateStatement = async (Client_id) => {
  const client = await Client.findById(Client_id)
  if (!client) {
    return null
  }
  const invoices = await Invoice.find({ Client_id })
  const payments = await Payment.find({ Client_id })

  const inv = [];
  const pay = [];

  for (let index = 0; index < invoices.length; index++) {
    const element = invoices[index];
    let data = {
      date: element.Invoice_date,
      particulars: `Bill - ${element.Client_bill_no}`,
      page: element.Invoice_no,
      debit: element.Invoice_amount,
      credit: 0,
    };
    inv.push(data);
  }

  for (let index = 0; index < payments.length; index++) {
    const element = payments[index];
    let data = {
      date: element.Payment_date,
      particulars: element.Payment_mode,
      page: element.Receipt_no,
      debit: 0,
      credit: element.Receive_amount,
    };
    pay.push(data);
  }


  const data = inv.concat(pay);

  const minDate = data.reduce((min, obj) => {
    const currentDate = new Date(obj.date);
    return currentDate < min ? currentDate : min;
  }, new Date(data[0].date));





  let sortedDates = data.sort(function (a, b) {
    return moment(a.date, 'DD-MMM-yy').format("X") - moment(b.date, 'DD-MMM-yy').format("X");
  });
  if (client?.OpeningBalance) {
    sortedDates.unshift({
      date: minDate,
      particulars: `Opening Balance`,
      page: "BF",
      debit: client?.OpeningBalance,
      credit: 0,
    });
  }




  const debitAmount = _arrSummation(sortedDates, 'debit')
  const creditAmount = _arrSummation(sortedDates, 'credit')
  const deuAmount = debitAmount - creditAmount

  const value = { debitAmount, creditAmount, deuAmount, data: sortedDates, Client_name: client.Client_name }
  return value

}

// getStatement("632c3ee31c57630a3cbe2fea")