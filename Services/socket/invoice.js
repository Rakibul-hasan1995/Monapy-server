const { json } = require("express");
const Client = require("../../Models/ClientModel");
const Invoice = require("../../Models/InvoiceModel");
const Order = require("../../Models/OrderModel");
const { _arrToObjBy_id, _arrSummation } = require("../../Utils/jsFunctions");

exports.handleInvoiceSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/invoice");
      nsp.on('connection', (socket) => {
         console.log('socket connected to "api/invoice"');
         const changeStream = Invoice.watch()
         changeStream.on('change', async (data) => {
            if (data.operationType == 'insert') {
               const inv = await modify(data.fullDocument._id)
               socket.emit("insert", inv);
            }
            if (data.operationType == 'delete') {
               const _id = data.documentKey._id
               socket.emit("delete", _id);
            }
            if (data.operationType == 'update') {
               const _id = data.documentKey._id
               const inv = await modify(_id)
               // const newData = data.updateDescription?.updatedFields
               const newData = inv
               const value = { _id, newData }
               socket.emit("changes", value);
            }
         })
         socket.on('disconnect', () => {
            console.log('socket disconnect to "api/invoice"');
            changeStream.close()
         })
      });
   } catch (error) {
      console.error(error)
   }
};


const modify = async (_id) => {
   let invoice = JSON.parse(JSON.stringify(await Invoice.findOne({ _id })))
   const order = JSON.parse(JSON.stringify(_arrToObjBy_id(await Order.find())))
   const client = _arrToObjBy_id(await Client.find())
   let Item = []
   Object.values(invoice['Items']).forEach(element => {
      let x = order[element]
      x = {
         ...x,
         OrderAmount: x.Order_qty * x.Order_rate,
         design: x['Item_avatar'],
      }
      Item.push(x)
   });
   invoice = {
      ...invoice,
      Client_name: client[invoice['Client_id']].Client_name,
      Client_address: client[invoice['Client_id']].Client_address,
      Invoice_amount: getParentage(_arrSummation(Item, 'OrderAmount'), invoice['Discount']),
      item: Item,
      design: Item[0]['design']
   }
   return invoice
}

const getParentage = (amm, discount) => {
   let y = (amm / 100) * discount
   let res = parseInt(amm) - parseInt(y)
   return res
}
