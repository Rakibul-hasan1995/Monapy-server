const express = require("express");
const cors = require('cors');

const path = require('path');
require('dotenv').config('../.env')
const { notFoundHandler, errorHandler } = require('./error')
const apiRoutes = require('../Routes/MainRoutes')
require('../db/dbConnection')
const app = express()
app.use(require('./middleware'))
apiRoutes(app)
app.use(require('./routes'))

app.use(errorHandler)







if (process.env.NODE_ENV === 'PRODUCTION') {
   app.use(express.static(path.join(__dirname, 'build')));
   app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
   });
 } 

app.use(notFoundHandler)


// app.use(cors({
//    origin: 'http://localhost:5173',
//    credentials: true
// }));





module.exports = app


