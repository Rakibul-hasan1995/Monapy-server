const morgan = require("morgan");
const cors = require("cors");
const express = require("express");
const bodyParser = require('body-parser');





const middleware = [
   morgan('dev'),
   cors(),
   express.json(),
   bodyParser.json({ limit: '50mb' }),
   bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
]

module.exports = middleware

