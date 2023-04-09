const Client = require("../../Models/ClientModel");
const R_goods = require("../../Models/Rec_goods_model");
const Order = require("../../Models/OrderModel");

exports.handleReceiveSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/rec-goods");
      nsp.on('connection', async (socket) => {
         console.log('socket connected to "api/rec-goods"');

         const changeStream = R_goods.watch()
         changeStream.on('change', async (data) => {
            if (data.operationType == 'insert') {
               const fullDocument = data.fullDocument
               const client = await Client.findOne({ _id: fullDocument.Client_id })
               const order = await Order.findOne({ _id: fullDocument.Order_id })
               const value = {
                  ...fullDocument,
                  Client_name: client.Client_name || '',
                  Order_no: order['Order_no'] || '',
                  Design: order['Item_avatar'] || '',
               }
               console.log({ value });
               socket.emit('insert', value);
            }
            if (data.operationType == 'delete') {
               const _id = data.documentKey._id
               socket.emit("delete", _id);
            }
            if (data.operationType == 'update') {
               const _id = data.documentKey._id
               const newData = data.updateDescription?.updatedFields
               const value = { _id, newData }
               socket.emit("changes", value);
            }
         })
         socket.on('disconnect', () => {
            console.log('socket disconnect to "api/rec-goods"');
            changeStream.close()
         })
      });
   } catch (error) {
      console.error(error)
   }
};
