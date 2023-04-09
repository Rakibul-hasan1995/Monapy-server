const axios = require('axios')
var base64Img = require('base64-img');
const request = require('request');
// const { Buffer } = require("buffer");
// var fs = require('fs')






exports._Base64ImageFromURL = async (url) => {

  return new Promise((resolve, reject) => {
    axios.get(url, { responseType: 'arraybuffer' })
      .then((image) => {
        let returnedB64 = 'data:image/png;base64,' + Buffer.from(image.data).toString('base64');
        resolve(returnedB64)
      }).catch((err) => {
        reject(err)
      });
  })
}
exports._Base64ImageFromURL2 = async (url) => {


  // return new Promise((resolve, reject) => {
  //   var request = require('request').defaults({ encoding: null });

  //   request.get(url, function (error, response, body) {
  //     if (!error && response.statusCode == 200) {
  //       data = "data:" + response.headers["content-type"] + ";base64," + Buffer.from(body).toString('base64');
  //       resolve(data)

  //     }else{
  //       console.log(error)
  //       reject(error)
  //     }

  //   });
  // })

  return new Promise(async (resolve, reject) => {
    base64Img.requestBase64(url, function (err, res, body) {
      if (!err) {
        resolve(body)
        // resolve('public/design.png')

      }
      else {
        console.log('my error', err)

        resolve('public/design.png')

      }
    })
  });
};



// exports._Base64ImageFromURL = (url) => {
//    return new Promise((resolve, reject) => {
//      var img = new Image();
//      img.setAttribute("crossOrigin", "anonymous");

//      img.onload = () => {
//        var canvas = document.createElement("canvas");
//        canvas.width = img.width;
//        canvas.height = img.height;

//        var ctx = canvas.getContext("2d");
//        ctx.drawImage(img, 0, 0);

//        var dataURL = canvas.toDataURL("image/png");

//        resolve(dataURL);
//      };

//      img.onerror = (error) => {
//        reject(error);
//      };

//      img.src = url;
//    });
//  };

