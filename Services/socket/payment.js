const Payment = require("../../Models/paymentModel");

exports.handlePaymentSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/payment");
      nsp.on('connection', async (socket) => {
         console.log('socket connected to "api/payment"');
         const changeStream = Payment.watch()
         socket.emit('connection', { message: `successfully connect to socketId: ${socket.id}` })
         changeStream.on('change', data => {
            if (data.operationType == 'insert') {
               socket.emit("insert", data.fullDocument);
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
            console.log('socket disconnect to "api/payment"');
            changeStream.close()
         })
      });
   } catch (error) {
      console.error(error)
   }
};
