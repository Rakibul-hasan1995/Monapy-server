
const Client = require('../Models/ClientModel');
const Invoice = require('../Models/InvoiceModel');
const Order = require('../Models/OrderModel');
const Payment = require('../Models/paymentModel');
const { _arrSummation, _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/client_validator');


exports.Create_client = async (req, res) => {

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

    res.send(client)
    // Save this Client to database <<-------

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.All_client = async (req, res, next) => {
  try {
    const clientsDB = await Client.find()
    let client = _arrToObjBy_id(clientsDB)
    let invoice = _arrToObjBy_id(await Invoice.find())
    let payment = _arrToObjBy_id(await Payment.find())
    let order = _arrToObjBy_id(await Order.find())
    // get invoice 


    for (let i = 0; i < Object.keys(invoice).length; i++) {
      const _id = Object.keys(invoice)[i];
      let orderArr = []
      Object.values(invoice[_id]['Items']).forEach(element => {
        orderArr.push(order[element].Order_qty * order[element].Order_rate)
      });
      const orderAmm = orderArr.reduce((acc, cur) => {
        return acc + cur
      }, 0)
      const disAmm = Number(orderAmm) / 100 * Number(invoice[_id].Discount)
      invoice[_id] = {
        ...invoice[_id]._doc,
        Invoice_amount___l: Number(orderAmm - disAmm).toFixed(2)
      }
    }

    for (let o = 0; o < Object.keys(client).length; o++) {
      const _id = Object.keys(client)[o];
      const InvAmm = _arrSummation(Object.values(invoice).filter((x) => x.Client_id == _id), 'Invoice_amount___l')
      const payMM = _arrSummation(Object.values(payment).filter((x) => x.Client_id == _id), 'Receive_amount')
      client[_id] = {
        ...client[_id]._doc,
        invoice: InvAmm + client[_id].OpeningBalance,
        payment: payMM,
        balance: InvAmm + client[_id].OpeningBalance - payMM
      }
    }
    res.send(client)
  } catch (error) {
    next(error)
  }
}




// exports.All_client = async (req, res) => {
//   try {
//     let client = await Client.find()
//     let arr = []
//     let inv = await Invoice.aggregate([
//       {
//         $group: {
//           _id: '$Client_id',
//           billAmount: {
//             $sum: "$Invoice_amount"
//           }
//         }
//       }
//     ]);
//     let payment = await Payment.aggregate([
//       {
//         $group: {
//           _id: '$Client_id',
//           paymentAmount: {
//             $sum: "$Receive_amount"
//           }
//         }
//       }
//     ]);

//     const obj = inv.reduce((a, i) => ({ ...a, [i._id]: i }), {})
//     const pau = payment.reduce((a, i) => ({ ...a, [i._id]: i }), {})

//     for (let i = 0; i < client.length; i++) {
//       const e = client[i];
//       if (obj[e._id]) {
//         if (pau[e._id]) {
//           let x = {
//             ...e._doc,
//             billAmount: obj[e._id]['billAmount'] + e.OpeningBalance,
//             paymentAmount: pau[e._id]['paymentAmount'],
//             deuAmount: obj[e._id]['billAmount'] + e.OpeningBalance - pau[e._id]['paymentAmount']
//           }
//           arr.push(x)
//         } else {
//           let x = {
//             ...e._doc,
//             billAmount: obj[e._id]['billAmount'] + e.OpeningBalance,
//             paymentAmount: 0,
//             deuAmount: obj[e._id]['billAmount'] + e.OpeningBalance
//           }
//           arr.push(x)
//         }

//       } else if (pau[e._id]) {
//         let p = {
//           ...e._doc,
//           billAmount: 0 + e.OpeningBalance,
//           paymentAmount: pau[e._id]['paymentAmount'],
//           deuAmount: - pau[e._id]['paymentAmount'] + e.OpeningBalance
//         }
//         arr.push(p)
//       } else {
//         let p = {
//           ...e._doc,
//           billAmount: 0,
//           paymentAmount: 0,
//           deuAmount: 0
//         }
//         arr.push(p)
//       }
//     }

//     res.send(arr)

//   } catch (e) {
//     console.log(e);
//     res.sendStatus(500)
//   }
// };


exports.Single_client = async (req, res) => {
  const _id = req.params.client_id
  try {
    if (req.token.User_role === 'client') {
      const client = await Client.findOne({ _id: req.token.User_company_id })
      if (!client) {
        return res.json('client Not found')
      } else {
        return res.send(client)
      }
    } else {

      const client = await Client.findOne({ _id })
      if (!client) {
        return res.json('client Not found')
      }
      res.send(client)
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


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
