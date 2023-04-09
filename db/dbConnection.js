const   mongoose  = require("mongoose");


const mongoUri = (process.env.MONGO_URI);
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(console.log('DB Connect'))
  .catch(err => console.log(`error: ${err}`))

