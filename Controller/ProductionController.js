
const Order = require('../Models/OrderModel');
const Production = require('../Models/ProductionModel');
const { _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/productionValidator');





exports.Create = async (req, res) => {
   const prod = req.body
   //--->> Check All Input value are valid---->>
   const Validator = validate(prod)
   if (!Validator.isValid) {
      return res.status(400).json(Validator.error)
   }
   //--->> Check All Input value are valid <<----

   try {
      // Save this Data to database ------->>
      const data = await Production.create(prod)
      data.Production_data.forEach(async (el) => {
         await Order.findOneAndUpdate({ _id: el.Order_id }, { $inc: { ProductionQty: el.qty } })
      });

      res.send(data)

      // Save this Data to database <<-------
   } catch (e) {
      console.log(e);
      res.sendStatus(500)
   }
};
const _passDate = (x) => {
   var d = new Date();
   d.setDate(d.getDate() - x);
   return d
}
exports.All_entry = async (req, res) => {
   const start = new Date(req.body?.start || _passDate(10))
   const end = new Date(req.body?.end || new Date())
   var d = new Date();
   d.setDate(d.getDate() - 15);
   try {
      const data = _arrToObjBy_id(await Production.find({
         createdAt: {
            $gte: start,
            $lte: end
         }
      }).sort({ Production_date: 1 }))
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
      let data = await Production.findOneAndUpdate(filter, req.body, { new: true });
      res.send(data)
   } catch (e) {
      console.log(e);
      res.sendStatus(500)
   }
};



exports.Delete = async (req, res) => {
   try {
      const data = await Production.deleteOne({ _id: req.query._id })
      if (data.deletedCount > 0) {
         res.sendStatus(200)
      } else {
         res.send(500)
      }

   } catch (e) {
      console.log(e);
      res.sendStatus(500)
   }
};


exports.groupByDay = async (req, res) => {
   try {
      let data = await Production.aggregate(
         [
            // { $match: { Date: { $gt: month + "-0", $lt: month + "-32" } } },
            {
               $group: {
                  _id: "$Production_date",
                  y: { $sum: "$Production_amount" },
               },
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
      res.send(data)
   } catch (error) {
      console.log(error)
   }
};

