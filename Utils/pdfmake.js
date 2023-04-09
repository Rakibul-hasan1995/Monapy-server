const fs = require('fs');

const Pdfmake = require('pdfmake');


var fonts = {
    Roboto: {
        normal: 'fonts/roboto/Roboto-Regular.ttf',
        bold: 'fonts/roboto/Roboto-Medium.ttf',
        italics: 'fonts/roboto/Roboto-Italic.ttf',
        bolditalics: 'fonts/roboto/Roboto-MediumItalic.ttf'
    }
};


let pdfmake = new Pdfmake(fonts);

let docDefination = {
    content: [
        'Hello World!'
    ],
}


let pdfDoc = pdfmake.createPdfKitDocument(docDefination, {});
pdfDoc.pipe(fs.createWriteStream('pdfs/test.pdf'));
pdfDoc.end();

app.get('/generate-pdf', (req, res) => {
 
   const doc = new pdfmake({
     Roboto: { normal: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64') }
   }).createPdfKitDocument({ content: 'test' })
   var chunks = [];
   var result;
   doc.on('readable', function () {
     var chunk;
     while ((chunk = doc.read(9007199254740991)) !== null) {
       chunks.push(chunk);
     }
   });
   doc.on('end', function () {
     result = Buffer.concat(chunks);
     res.setHeader('Content-Type', 'application/pdf');
     res.setHeader('Content-disposition', 'attachment; filename=test.pdf');
     res.send(result);
   });
   doc.end();
  
 });


