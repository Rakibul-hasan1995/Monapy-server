const { getQueryOrder } = require("../../Controller/orderController");
const Order = require("../../Models/OrderModel");

exports.handleOrderSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/order");
      nsp.on('connection', (socket) => {
         console.log('socket connected to "api/order"');
         const changeStream = Order.watch()
         changeStream.on('change', async (data) => {
            if (data.operationType == 'insert') {
               let order = data.fullDocument
               let resData = await getQueryOrder({ _id: order._id })
               socket.emit("insert", resData);
            }
            if (data.operationType == 'delete') {
               const _id = data.documentKey._id
               socket.emit("delete", _id);
            }
            if (data.operationType == 'update') {
               const _id = data.documentKey._id
               // const updateData = data.updateDescription?.updatedFields
               // const value = { _id, updateData }
               let resData = await getQueryOrder({ _id })

               socket.emit("changes", resData);
            }
         })
         socket.on('disconnect', () => {
            console.log('socket disconnect to "api/order"');
            changeStream.close()
         })
      });
   } catch (error) {
      console.error(error)
   }
};


