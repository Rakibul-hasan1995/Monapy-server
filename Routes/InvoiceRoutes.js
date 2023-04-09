const router = require("express").Router();

const check_Logger = require("../Middleware/check_Logger");
const admin_Checker = require("../Middleware/admin_Checker");

const { All_invoice, Create_Invoice, getQuery, groupByDay, generatePdf, groupXy,Update_invoice, Delete_invoice } = require("../Controller/invoiceController");

router.get("/query", admin_Checker, getQuery);
router.get("/group-by-day", admin_Checker, groupByDay);
router.get("/xy", admin_Checker, groupXy);
router.get("/generate-pdf", generatePdf);
router.get("/", admin_Checker, All_invoice);

// router.get("/:invoice_id", check_Logger, Single_Order);

router.post("/create", admin_Checker, Create_Invoice);

// router.delete("/", admin_Checker, Delete_Client);

// router.put("/", admin_Checker, Update_Client);
















module.exports = router;
