const router = require("express").Router();

const check_Logger = require("../Middleware/check_Logger");
const admin_Checker = require("../Middleware/admin_Checker");

const { All_invoice, Create_Invoice, getQuery, generatePdf,getCount, groupXy } = require("../Controller/invoiceController");

router.get("/query", admin_Checker, getQuery);
router.get("/count", admin_Checker, getCount);
router.get("/xy", admin_Checker, groupXy);
router.get("/generate-pdf", generatePdf);
router.get("/", admin_Checker, All_invoice);
router.post("/", admin_Checker, Create_Invoice);

// router.get("/:invoice_id", check_Logger, Single_Order);


// router.delete("/", admin_Checker, Delete_Client);

// router.put("/", admin_Checker, Update_Client);
















module.exports = router;
