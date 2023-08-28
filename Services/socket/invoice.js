const { json } = require("express");
const Client = require("../../Models/ClientModel");
const Invoice = require("../../Models/InvoiceModel");
const Order = require("../../Models/OrderModel");
const { _arrToObjBy_id, _arrSummation } = require("../../Utils/jsFunctions");
const { getInvoiceXY } = require("../../Controller/invoiceController");

exports.handleInvoiceSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/invoice");
      nsp.on('connection', (socket) => {
         console.log('socket connected to "api/invoice"');
         const changeStream = Invoice.watch()
         changeStream.on('change', async (data) => {
            const xy = await getInvoiceXY()
            socket.emit("xyData", xy);
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
               socket.emit("changes", inv);
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
   const invoice = await Invoice.findOne({ _id })
      .populate('Items')
      .populate({ path: 'Client_id', select: ['Client_name', 'Client_address'] })
      .exec();
   return invoice
}

