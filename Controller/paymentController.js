
const Client = require('../Models/ClientModel');
const Payment = require('../Models/paymentModel');
const { _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/PaymentValidator');



exports.Create = async (req, res, next) => {
  //--->> Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  //--->> Check All Input value are valid <<----

  try {
    // Save this Client to database ------->>
    const payment = await Payment.create(req.body)
    const client = await Client.findOne({ _id: req.body.Client_id })
    let data = {

      _id: payment['_id'],
      Payment_date: payment['Payment_date'],
      Client_id: payment['Client_id'],
      Client_name: client['Client_name'],
      Receipt_no: payment['Receipt_no'],
      Payment_description: payment['Payment_description'],
      Payment_mode: payment['Payment_mode'],
      Receive_amount: payment['Receive_amount']

    }
    console.log(data);
    res.send(data)
    // Save this Client to database <<-------

  } catch (e) {
    next(e)
  }
};


exports.All_entry = async (req, res) => {

  try {
    const data = _arrToObjBy_id(await Payment.find({}))
    await getModifiedData(data)
    res.send(data)

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
    let data = await Payment.findOneAndUpdate(filter, req.body, { new: true });
    res.send(data)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.Delete = async (req, res) => {
  try {
    const data = await Payment.deleteOne({ _id: req.body._id })
    res.sendStatus(200)
    console.log(data);

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};

exports.groupXy = async (req, res, next) => {
  try {
    const pay = await Payment.find()
    let x = pay.map((data) => {
      return {

        x: data.Payment_date,
        y: data.Receive_amount,
        Client_id: data.Client_id
      }
    })
    res.send(x)
  } catch (e) {
    next(e)
  }
};

const getModifiedData = async (payment) => {
  const client = _arrToObjBy_id(await Client.find({}))
  for (let i = 0; i < Object.values(payment).length; i++) {
    const _id = Object.values(payment)[i]._id
    const data = payment[_id]
    payment[_id] = {
      _id,
      Payment_date: data['Payment_date'],
      Client_id: data['Client_id'],
      Client_name: client[data['Client_id']].Client_name,
      Receipt_no: data['Receipt_no'],
      Payment_description: data['Payment_description'],
      Payment_mode: data['Payment_mode'],
      Receive_amount: data['Receive_amount']
    }
  }
  return payment
}



