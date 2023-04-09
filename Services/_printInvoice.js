
const { _arrSummation } = require("../Utils/Utils/arrSummation")
const { _addLeadingZeros } = require("../Utils/Utils/add-landing-zero")
const { numberFormate } = require("../Utils/Utils/number-formatting")
const { _Base64ImageFromURL } = require('../Utils/Utils/base64image')
const { ToWords } = require('to-words')
const Pdfmake = require('pdfmake');
const moment = require("moment/moment")


const toWords = new ToWords({
   localeCode: 'en-BD',
   converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
   }
});

const getParentage = (item) => {
   const amm = _arrSummation(item.item, 'OrderAmount')
   const dis = item.Discount
   const res = Number(amm) / 100 * Number(dis)
   return res.toFixed(2)
}

exports._printInvoice = async (item, res) => {
   var rows = [];
   rows.push([
      {
         text: 'Style',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: 'Design',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: 'CH-NO',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: 'Qty',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: 'Rate',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: 'Total(USD)',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: 'Total(BDT)',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },

   ]);
   for (let i = 0; i < item.item.length; i++) {
      rows.push([

         {
            text: `${item.item[i].Order_no}`,
            style: 'tableCell',
            alignment: 'center',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         // {
         //    text: `${item.item[i].Order_no}`,
         //    style: 'tableCell',
         //    alignment: 'center',
         //    borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         // },
         {
            image: await _Base64ImageFromURL(item.item[i].design),
            width: 40,
            height: 25,
            alignment: 'center',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],

         },
         {
            text: `${item.item[i].Delivery_ch_no || 'null'}`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],

         },

         {
            text: `${item.item[i].Order_qty} Pcs`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         {
            text: `${numberFormate(Number(item.item[i].Order_rate).toFixed(2))}`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],

         },
         {
            text: `---`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         {
            text: `${numberFormate(Number(item.item[i].Order_rate * item.item[i].Order_qty).toFixed(2))}`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
      ]);
   }
   if (item.Discount) {
      rows.push([
         {
            colSpan: 4,
            text: `Discount Of Percent`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         {
            text: ` `,
            style: 'tableCell',
            alignment: 'center',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         {
            text: ``,
            style: 'tableCell',
            alignment: 'center',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },

         {
            text: ``,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         {
            colSpan: 2,
            text: `${Number(item.Discount).toFixed(2)} %`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         {
            text: ``,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
         {
            text: `- ${getParentage(item)}`,
            // text: `- ${_arrSummation(item.item, 'OrderAmount') / 100 * item.Discount}`,
            style: 'tableCell',
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         },
      ]);
   }
   rows.push([
      {
         fontSize: 8,
         text: 'Total =',
         style: 'tableHeader',
         // fontSize: 10,
         colSpan: 3,
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         // borderWidth: 0.5
      },
      {
         text: `${_arrSummation([4, 1])} Pcs`,
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: '',
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         fontSize: 9,
         text: `${_arrSummation(item.item, 'Order_qty')} Pcs`,
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         text: `--`,
         fontSize: 10,
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         fontSize: 9,
         text: `---`,
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },
      {
         fontSize: 9,
         text: `${Number(item.Invoice_amount).toFixed(2)} BDT`,
         style: 'tableHeader',
         borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
      },

   ]);
   let dd = {
      header: {
         image: await _Base64ImageFromURL("https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png"),
         width: 595.28,
         margin: [0, 20],
      },
      content: [
         {
            margin: [0, 110, 0, 0],
            columns: [
               {
                  lineHeight: 1.3,
                  width: '*',
                  fontSize: 10,
                  text: `Bill To. \n ${item.Client_name} \n ${item.Client_address}`
               },
               {
                  width: '*',
                  lineHeight: 1.3,
                  // alignment: 'right',
                  fontSize: 10,
                  text: `Invoice Date : ${moment(item.Invoice_date).format('DD-MMM-YY')} \n Invoice No : ${item.Invoice_no} \n Bill No : ${_addLeadingZeros(item.Client_bill_no, 2)}`,
               },
            ],
            
            columnGap: 250
         },
         {
            fontSize: 10,
            bold: true,
            margin: [0, 10],
            text: 'Sub: Bill For Emb Work'
         },
         {
            style: 'table',
            table: {
               widths: ['*', '*', 60, '*', '*', 70, 70],
               body: rows
            }
         },
         {
            fontSize: 9,
            text: `in word:  ${toWords.convert(Number(item.Invoice_amount))}  \n  
            ${item.Comments ? 'Note : - ' + item.Comments : ''} \n \n`
         },



         // {
         //    fontSize: 9,
         //    text: `
         //    Prev Deu = ${item.totalBillOfClient - item.Invoice_amount} \n
         //     Bill Amount = ${item.Invoice_amount} \n
         //     Total Deu = ${item.totalBillOfClient}
         //    `
         // },
         {
            style: 'table',
            table: {
               widths: ['*'],
               body: [{

                  fontSize: 9,
                  text: `---`,
                  style: 'tableHeader',
                  borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],

               }]
            }
         },
         {
            margin: [0, 80, 0, 0],
            fontSize: 10,
            italics: true,
            color: '#020068',
            text: 'Early Payment Will Be Appreciated \n \n Thanks'
         },

         {
            margin: [20, 50],
            columns: [
               {
                  width: '*',
                  alignment: 'left',
                  decoration: 'underline',
                  fontSize: 9,
                  text: `Received By`
               },
               {
                  width: '*',
                  decoration: 'underline',
                  alignment: 'right',
                  fontSize: 9,
                  text: `For: Monapy Embroidery`
               },
               // {
               //    image: await getSign(opt),
               //    width: 120,
               //    margin: [0, -40],

               // },

            ],
            // columnGap: 10
         },
      ],


      styles: {
         header: {
            fontSize: 12,
            bold: true,
            margin: [0, 0, 0, 10]
         },
         table: {
            margin: [0, 10, 0, 15]
         },
         tableCell: {
            margin: [0, 7, 0, 0],
            fontSize: 9,
            color: '#333',
            alignment: 'center',
         },
         tableHeader: {
            bold: true,
            fontSize: 10,
            alignment: 'center',
            color: 'black',

            fillColor: '#F3F3F3',
            margin: [0, 3]
         },
      },
   }
   const doc = new Pdfmake({
      Roboto: {
         normal: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
         italics: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
         bold: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
         bolditalics: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-MediumItalic.ttf'], 'base64'),
      }
   }).createPdfKitDocument(dd)


   var chunks = [];
   var result;
   doc.on('readable', function () {
      var chunk;
      while ((chunk = doc.read(10)) !== null) {
         chunks.push(chunk);
      }
   });
   
   doc.on('end', function () {
      result = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-disposition', 'attachment; invoice.pdf');
      res.send(result);
   });
   doc.end()
}
