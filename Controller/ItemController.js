
const Item = require('../Models/ItemModel');

const validate = require('../Validators/Item_validator');



exports.Create_Item = async (req, res) => {


  // Check This item is already create ? ---->>
  const existItem = await Item.findOne({ Item_name: req.body.Item_name })
  if (existItem) {
    return res.status(400).json({ 'Item_name': `(${req.body.Item_name})  already exist` })
  }
  // Check This item is already create ? <<----

  // Check All Input value are valid---->>
  const Validator = validate(req.body)
  if (!Validator.isValid) {
    return res.status(400).json(Validator.error)
  }
  // Check All Input value are valid <<----


  const obj = {
    ...req.body,
    Item_avatar: req.file.link
  }

  try {
    // Save this item to database ------->>
    const data = await Item.create(obj)
    res.send(data)
    // Save this item to database <<-------

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


exports.All_item = async (req, res) => {
  try {
    const data = await Item.find()
    res.send(data)

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.Update_item = async (req, res) => {
  const filter = {
    _id: req.body._id
  }
  const update = {
    Item_name: req.body.Item_name,
    Item_type: req.body.Item_type,
    Item_avatar: req.body.Item_avatar,
    Item_description: req.body.Item_description,
    Item_unit: req.body.Item_unit,
    Item_stitch: req.body.Item_stitch,
  }
  try {
    let data = await Item.findOneAndUpdate(filter, update, { new: true });
    res.send(data)
  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};



exports.Delete_item = async (req, res) => {
  try {
    const data = await Item.deleteOne({ _id: req.body._id })
    res.sendStatus(200)
    console.log(data);

  } catch (e) {
    console.log(e);
    res.sendStatus(500)
  }
};


