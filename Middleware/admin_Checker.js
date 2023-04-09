// const jwtDecode = require('jwt-decode')
const jwt = require('jsonwebtoken')



const admin_checker = (req, res, next) => {
   try {
      next()
      // let token = req.headers['access_token']
      // if (!token) {
      //    token = req.cookie['access_token']
      // }
      // // console.log({token});

      // const validToken = jwt.verify(token, process.env.JWT_SECRET)
      // if (validToken) {
      //    const role = validToken.User_role
      //    if (role === 'admin') {
      //       next()
      //    } else {
      //       return res.sendStatus(403).json({
      //          error: new Error('Invalid request!')
      //       });
      //    }
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


module.exports = admin_checker