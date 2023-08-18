const Payment = require("../../Models/paymentModel");
const Client = require("../../Models/ClientModel");
const { getPaymentXY } = require("../../Controller/paymentController");

exports.handlePaymentSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/payments");
      nsp.on('connection', async (socket) => {
         console.log('socket connected to "api/payment"');
         const changeStream = Payment.watch()
         socket.emit('connection', { message: `successfully connect to socketId: ${socket.id}` })
         changeStream.on('change', async (data) => {
            if (data.operationType == 'insert') {
               const fullDocument = data.fullDocument
               const value = {
                  ...fullDocument,
               }
               socket.emit("insert", value);

               const xy = await getPaymentXY()
               socket.emit("xyData", xy);
            }
            if (data.operationType == 'delete') {
               const _id = data.documentKey._id
               socket.emit("delete", _id);

               const xy = await getPaymentXY()
               socket.emit("xyData", xy);
            }
            if (data.operationType == 'update') {
               const _id = data.documentKey._id
               const value = await Payment.findById(_id)
                  .populate('Client_id', 'Client_name')
                  .select('_id Payment_date Client_id Client_name Receipt_no Payment_description Payment_mode Receive_amount');
               socket.emit("changes", value);

               const xy = await getPaymentXY()
               socket.emit("xyData", xy);
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
