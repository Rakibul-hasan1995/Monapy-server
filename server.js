var http = require('http');
require('dotenv').config()
const app = require('./app/app')
var sio = require('socket.io');
const { handleClientSocket } = require('./Services/socket/clients');
const { handleOrderSocket } = require('./Services/socket/orders');
const { handleDeliverySocket } = require('./Services/socket/delivery');
const { handleReceiveSocket } = require('./Services/socket/receive');
const { handleProductionSocket } = require('./Services/socket/production');
const { handleInvoiceSocket } = require('./Services/socket/invoice');
const { handlePaymentSocket } = require('./Services/socket/payment');
const server = http.createServer(app)
var socketIo = sio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

handleClientSocket(socketIo)
handleOrderSocket(socketIo)
handleDeliverySocket(socketIo)
handleReceiveSocket(socketIo)
handleProductionSocket(socketIo)
handleInvoiceSocket(socketIo)
handlePaymentSocket(socketIo)

app.set('socketIo', socketIo);

const port = process.env.PORT
server.listen(port, () => {
  console.log(`App listening at-->> http://localhost:${port}`)
})
