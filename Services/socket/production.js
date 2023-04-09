const Production = require("../../Models/ProductionModel");

exports.handleProductionSocket = async (socketIo) => {
   try {
      const nsp = socketIo.of("/api/production");
      nsp.on('connection', (socket) => {
         console.log('socket connected to "api/production"');
         const changeStream = Production.watch()
         socket.emit('connection', { message: `successfully connect to socketId: ${socket.id}` })
         changeStream.on('change', data => {
            console.log('change');
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
            console.log('socket disconnect to "api/production"');
            changeStream.close()
         })
      });
   } catch (error) {
      console.error(error)
   }
};
