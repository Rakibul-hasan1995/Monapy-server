const router = require("express").Router();

const admin_Checker = require("../Middleware/admin_Checker");

const { All_entry, Create, Delete, Update, groupByDay, getProductionByOrder_id, getProductionQuery } = require("../Controller/ProductionController");

router.post("/", admin_Checker, Create);
router.delete("/", Delete);
router.put("/", admin_Checker, Update);
router.get("/by-order/:Order_id", admin_Checker, getProductionByOrder_id);
router.get("/group-by-day", admin_Checker, groupByDay);
router.get("/query", admin_Checker, getProductionQuery);
router.get("/", admin_Checker, All_entry);

module.exports = router;
