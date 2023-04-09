const router = require("express").Router();

const admin_Checker = require("../Middleware/admin_Checker");

const { All_entry, Create, Delete, Update,GetDataByOrder } = require("../Controller/DelGoodsController");


router.post("/create", admin_Checker, Create);

router.delete("/", admin_Checker, Delete);

router.put("/", admin_Checker, Update);
router.get("/by-order", admin_Checker, GetDataByOrder);
router.get("/", admin_Checker, All_entry);

module.exports = router;
