const axios = require('axios')
var base64Img = require('base64-img');
const request = require('request');


// exports._Base64ImageFromURL = async (url) => {

//   return new Promise((resolve, reject) => {
//     axios.get(url, { responseType: 'arraybuffer' })
//       .then((image) => {
//         let returnedB64 = 'data:image/png;base64,' + Buffer.from(image.data).toString('base64');
//         resolve(returnedB64)
//       }).catch((err) => {
//         reject(err)
//       });
//   })
// }

async function _Base64ImageFromURL(url) {
   try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary'); // Use Buffer.from() here
      const base64Image = imageBuffer.toString('base64');
      return `data:image/png;base64,${base64Image}`;
   } catch (error) {
      console.error('Error fetching image:', error);
     
   }
}

module.exports = {
   _Base64ImageFromURL,
};
