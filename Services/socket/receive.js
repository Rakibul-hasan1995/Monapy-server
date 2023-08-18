const R_goods = require("../../Models/Rec_goods_model");

exports.handleReceiveSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/rec-goods");
      nsp.on('connection', async (socket) => {
         console.log('socket connected to "api/rec-goods"');

         const changeStream = R_goods.watch()
         changeStream.on('change', async (data) => {
            if (data.operationType == 'insert') {
               const _id = data.fullDocument._id
               const recData = await R_goods.findById(_id)
                  .populate('Client_id', 'Client_name')
                  .populate('Order_id', ['Order_no', 'Item_avatar'])
               socket.emit('insert', recData);
            }
            if (data.operationType == 'delete') {
               const _id = data.documentKey._id
               socket.emit("delete", _id);
            }
            if (data.operationType == 'update') {
               const _id = data.documentKey._id
               const recData = await R_goods.findById(_id)
                  .populate('Client_id', 'Client_name')
                  .populate('Order_id', ['Order_no', 'Item_avatar'])
               socket.emit("changes", recData);
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
