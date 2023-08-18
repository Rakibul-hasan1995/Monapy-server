const router = require("express").Router();
const upload = require('../Utils/multer')

const admin_Checker = require("../Middleware/admin_Checker");

const { Create_Order, getRunningOrder, clone_Order, Update_Order, orderQuery, uploadImage, deleteOrder } = require("../Controller/orderController");

router.get("/query", admin_Checker, orderQuery);
router.get("/clone", clone_Order);

router.post("/upload", upload.single('file'), uploadImage);


// router.delete("/", admin_Checker, Delete_Client);
// router.get("/:Order_id", check_Logger, Single_Order);

router.get("/", admin_Checker, getRunningOrder);
router.put("/", admin_Checker, Update_Order);
router.post("/", admin_Checker, upload.single('file'), Create_Order);
router.delete("/:_id", admin_Checker, deleteOrder);


module.exports = router;

