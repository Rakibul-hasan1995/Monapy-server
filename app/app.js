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

// // // View Frontend 
// // if (process.env.NODE_ENV === 'production') {
// app.use(express.static(path.join(__dirname, 'build')));
// app.get('*', (req, res) => {
//    res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
// // }
// // View Frontend 

app.use(notFoundHandler)
app.use(errorHandler)

// app.use(cors({
//    origin: 'http://localhost:5173',
//    credentials: true
// }));




// if (process.env.NODE_ENV === 'production') {
//    app.use(express.static(path.join(__dirname, 'build')));
//    app.get('*', (req, res) => {
//      res.sendFile(path.join(__dirname, 'build', 'index.html'));
//    });
//  } 


module.exports = app


