const router = require("express").Router();

const admin_Checker = require("../Middleware/admin_Checker");

const {
   All_entry, Create_R_goods, DeleteR_goods, Update_R_Goods, recQuery
} = require("../Controller/recGoodsController");


router.post("/",admin_Checker, Create_R_goods);
router.delete("/", admin_Checker, DeleteR_goods);
router.put("/", admin_Checker, Update_R_Goods);
router.get("/query", admin_Checker, recQuery);
router.get("/", admin_Checker, All_entry);

module.exports = router;
