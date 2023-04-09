const cloudinary = require('cloudinary').v2

cloudinary.config({
   cloud_name: process.env.Cloudinary_Name,
   api_key: process.env.Cloudinary_Api_key,
   api_secret: process.env.Cloudinary_Api_secret,
})


module.exports = cloudinary