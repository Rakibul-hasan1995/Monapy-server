
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

    const paymentData = await Payment.findById(payment._id)
      .populate('Client_id', 'Client_name')
      .select('_id Payment_date Client_id Client_name Receipt_no Payment_description Payment_mode Receive_amount');

    res.send(paymentData)
    // Save this Client to database <<-------

  } catch (e) {
    next(e)
  }
};


exports.All_entry = async (req, res) => {
  try {
    const paymentData = await Payment.find({})
      .populate('Client_id', 'Client_name')
      .select('_id Payment_date Client_id Client_name Receipt_no Payment_description Payment_mode Receive_amount');

    // const data = _arrToObjBy_id(await Payment.find({}))
    // await getModifiedData(data)
    res.send(paymentData)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};




exports.getQuery = async (req, res, next) => {
  try {
    if (!Object.keys(req.query).length) {
      return res.status(400).json({ massage: 'Query Sting Not Valid' })
    }
    const paymentData = await Payment.find(req.query)
      .populate('Client_id', 'Client_name')
      .select('_id Payment_date Client_id Client_name Receipt_no Payment_description Payment_mode Receive_amount');

    res.status(200).json(paymentData)

  } catch (error) {
    next(error)
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
    const pay = await getPaymentXY()
    res.status(200).json(pay)
  } catch (e) {
    next(e)
  }
};

const getPaymentXY = exports.getPaymentXY = async () => {
  try {
    let data = await Payment.aggregate(
      [
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$Payment_date' } },
            y: { $sum: '$Receive_amount' }
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

