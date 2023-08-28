
const { _arrSummation } = require("../Utils/Utils/arrSummation")
const { _addLeadingZeros } = require("../Utils/Utils/add-landing-zero")
const { numberFormate } = require("../Utils/Utils/number-formatting")
const { _Base64ImageFromURL } = require('../Utils/Utils/base64image')
const { ToWords } = require('to-words')
const Pdfmake = require('pdfmake');
const moment = require("moment")


const getLine = () => {
   return (
      {
         canvas: [
            {
               type: 'rect',
               x: 0, y: 8, w: 513.28, h: 0.5,
               color: ['red', 'gray'],
            }
         ]
      }
   )
}

const options = {
   date: {
      align: "left",
      summation: false,
      searchAble: true,
      editable: false,
      style: {},
      type: "date",
      label: "Date",
   },
   particulars: {
      align: "left",
      summation: false,
      searchAble: true,
      editable: false,
      style: {},
      type: "text",
      label: "Particulars",
   },
   page: {
      align: "left",
      summation: false,
      searchAble: false,
      editable: false,
      style: {},
      type: "text",
      label: "Page",
   },
   debit: {
      align: "right",
      summation: true,
      searchAble: false,
      editable: false,
      style: {},
      type: "currency",
      label: "Debit",
   },
   credit: {
      align: "right",
      summation: true,
      searchAble: false,
      editable: false,
      style: { align: "right" },
      type: "currency",
      label: "Credit",
      footer: 'deuAmount',
   },
};





exports._printStateMent = async (item, res) => {


   const utils = {
      topTitle: ` Sub ledger for : ${"Client?.Client_name"}`,
      topSubTitle: "",
      customFooter: true,
      header: "Monapy Embroidery",
   };

   let tableWidth = ["*", "*", 60, "*", "*"];

   const rowsData = item.data




   var rows = [];
   rows.push(Object.keys(options)
      .filter((x) => x.type !== 'action')
      .map((key) => (
         {
            text: options[key].label,
            style: 'tableHeader',
            alignment: options[key].align,
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         }
      ))
   );
   for (let index = 0; index < rowsData.length; index++) {
      const element = rowsData[index];
      rows.push(Object.keys(options)
         .filter((x) => x.type !== 'action')
         .map((key) => (
            {
               text: getCell(element[key], key, options),
               // text: element[key],
               style: 'tableCell',
               alignment: options[key].align,
               borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
            }
         ))
      )
   }
   rows.push(Object.keys(options)
      .filter((x) => x.type !== 'action')
      .map((key) => (
         {
            text: getFooter(rowsData, key, options),
            style: 'tableHeader',
            alignment: options[key].align,
            borderColor: ['#dee2e6', '#dee2e6', '#dee2e6', '#dee2e6'],
         }
      ))
   );

   let content = [
      utils.header && getLine(utils),
      {
         fontSize: 12,
         bold: true,
         margin: [0, 10, 0, 0],
         text: utils.topTitle
      },
      {
         fontSize: 10,
         bold: true,
         margin: [0, 2],
         text: utils.topSubTitle
      },
      {
         style: 'table',
         table: {
            widths: tableWidth,
            body: rows
         }
      },
      {
         fontSize: 10,
         bold: true,
         text: `Print at : ${moment().format('DD-MMM-YY, h:mma')}`
      },
   ]


   // header: {
   //    image: await _Base64ImageFromURL("https://res.cloudinary.com/dbu76a0wo/image/upload/v1663769776/padTop_yluxqh.png"),
   //    width: 595.28,
   //    margin: [0, 20],
   // },

   let dd = {
      content: content,
      styles: {
         header: {
            fontSize: 21,
            bold: true,
            italics: true,
            margin: [0, 15, 0, 10],
            alignment: 'center'
         },

         table: {
            margin: [0, 10, 0, 10]
         },
         tableCell: {
            margin: [0, 2, 0, 0],
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
