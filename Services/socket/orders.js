const Order = require("../../Models/OrderModel");

exports.handleOrderSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/order");
      nsp.on('connection', (socket) => {
         console.log('socket connected to "api/order"');
         const changeStream = Order.watch()
         changeStream.on('change', data => {
            if (data.operationType == 'insert') {
               let order = data.fullDocument
               order = {
                  ...order,
                  OrderAmount: order.Order_qty * order.Order_rate,
               }
               socket.emit("insert", order);
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
            console.log('socket disconnect to "api/order"');
            changeStream.close()
         })
      });
   } catch (error) {
      console.error(error)
   }
};
