const router = require("express").Router();

const admin_Checker = require("../Middleware/admin_Checker");

const { All_entry, Create, Delete, Update, groupByDay } = require("../Controller/ProductionController");

router.post("/create", admin_Checker, Create);
router.delete("/", Delete);
router.put("/", admin_Checker, Update);

router.get("/group-by-day", admin_Checker, groupByDay);
router.get("/", admin_Checker, All_entry);

module.exports = router;
