const router = require("express").Router();

const admin_Checker = require("../Middleware/admin_Checker");

const { All_entry, Create, Delete, Update, delQuery } = require("../Controller/DelGoodsController");


router.post("/", admin_Checker, Create);

router.get("/query", admin_Checker, delQuery);
router.get("/", admin_Checker, All_entry);
router.delete("/", admin_Checker, Delete);
router.put("/", admin_Checker, Update);

module.exports = router;
