const Client = require("../../Models/ClientModel");
const D_goods = require("../../Models/Del_goods_model");
const Order = require("../../Models/OrderModel");


exports.handleDeliverySocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/del-goods");
      nsp.on('connection', async (socket) => {
         console.log('socket connected to "api/del-goods"');
         const changeStream = D_goods.watch()
         socket.emit('connection', { message: `successfully connect to socketId: ${socket.id}` })
         changeStream.on('change', async (data) => {
            if (data.operationType == 'insert') {
               let fullDocument = data.fullDocument
               const resData = await D_goods.findById(fullDocument._id)
               .populate('Client_id', 'Client_name')
               .populate('Order_id', ['Order_no', 'Item_avatar'])
         
               socket.emit("insert", resData);
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
            console.log('socket disconnect to "api/del-goods"');
            changeStream.close()
         })
      });
   } catch (error) {
      console.error(error)
   }
};
