const router = require("express").Router();

const check_Logger = require("../Middleware/check_Logger");
const admin_Checker = require("../Middleware/admin_Checker");

const {
   All_entry, Update, Delete, Create, groupXy, getQuery
} = require("../Controller/paymentController");

router.get("/xy", admin_Checker, groupXy);
router.get("/query", admin_Checker, getQuery);

router.get("/", admin_Checker, All_entry);

router.post("/", admin_Checker, Create);
router.delete("/", admin_Checker, Delete);

router.put("/", admin_Checker, Update);

module.exports = router;
