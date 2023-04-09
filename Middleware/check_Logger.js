// const jwtDecode = require('jwt-decode')
const jwt = require('jsonwebtoken')



const check_logger = (req, res, next) => {
   try {
      next()
      // let token = req.headers['access_token']
      // if (!token) {
      //    token = req.cookie['access_token']
      // }
      // const validToken = jwt.verify(token, process.env.JWT_SECRET)
      // if (validToken) {
      //    req.token = validToken
      //    next()
      // } else {
      //    return res.sendStatus(403).json({
      //       error: new Error('Invalid request!')
      //    });
      // }
   } catch (error) {
      return res.sendStatus(403).json({
         error: new Error('Invalid request!')
      });
   }
};


module.exports = check_logger