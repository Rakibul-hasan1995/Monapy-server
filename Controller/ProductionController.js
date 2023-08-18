
const { isValidObjectId } = require('mongoose');
const Order = require('../Models/OrderModel');
const Production = require('../Models/ProductionModel');
const { _arrToObjBy_id } = require('../Utils/jsFunctions');
const validate = require('../Validators/productionValidator');


exports.Create = async (req, res, next) => {
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

      res.status(200).json(data)
      // Save this Data to database <<-------
   } catch (e) {
      next(e)
   }
};

exports.All_entry = async (req, res, next) => {
   try {
      const data = await Production.find()
         .sort({ Production_date: -1 })
         .limit(65)
      res.status(200).json(data)
   } catch (e) {
      next(e)
   }
};
exports.getProductionByOrder_id = async (req, res, next) => {
   try {
      const { Order_id } = req.params;
      if (!isValidObjectId(Order_id)) {
         return res.status(401).json({ "message": 'data not found' })
      }
      const data = await Production.find({ 'Production_data.Order_id': Order_id, })
         .sort({ Production_date: -1 })
      res.status(200).json(data)
   } catch (e) {
      next(e)
   }
};
exports.getProductionQuery = async (req, res, next) => {
   try {
      const data = await Production.find(req.query)
         .sort({ Production_date: -1 })
      res.status(200).json(data)
   } catch (e) {
      next(e)
   }
};


exports.Update = async (req, res, next) => {
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
      res.status(200).json(data)
   } catch (e) {
      console.log(e);
      res.sendStatus(500)
   }
};



exports.Delete = async (req, res, next) => {
   try {
      const data = await Production.deleteOne({ _id: req.query._id })
      if (data.deletedCount > 0) {
         res.sendStatus(200)
      } else {
         res.status(500).json({ "message": 'Data not found' })
      }
   } catch (e) {
      next(e)
   }
};


exports.groupByDay = async (_req, res, next) => {
   try {
      let data = await getProductionXY()
      res.status(200).json(data)
   } catch (error) {
      next(error)
   }
};



const getProductionXY = exports.getProductionXY = async () => {
   try {
      let data = await Production.aggregate(
         [
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
      return data
   } catch (error) {
      throw new Error(error)
   }
};

