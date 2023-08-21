// const jwtDecode = require('jwt-decode')
const jwt = require('jsonwebtoken')



const admin_checker = (req, res, next) => {
   try {
      let token = req.headers['access_token']
      if (!token) {
         token = req.cookie['access_token']
      }

      if (!token) {
         return res.sendStatus(403).json({
            error: new Error('Invalid request!')
         });
      }

      const validToken = jwt.verify(token, process.env.JWT_SECRET)
      if (validToken) {
         const role = validToken.User_role
         if (role === 'admin') {
            req.User_id = validToken.User_id
            req.User_name = validToken.User_name
            req.User_role = validToken.User_role
            next()
         } else {
            return res.sendStatus(403).json({
               error: new Error('Invalid request!')
            });
         }
      } else {
         return res.sendStatus(403).json({
            error: new Error('Invalid request!')
         });
      }
   } catch (error) {
      console.log(error)
      return res.status(403).json({ message: "Invalid request!" })
   }
};


module.exports = admin_checker