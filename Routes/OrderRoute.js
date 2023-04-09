const router = require("express").Router();
const upload = require('../Utils/multer')

const admin_Checker = require("../Middleware/admin_Checker");

const { Create_Order, All_Order, clone_Order, Update_Order, getOrderDetailsById, orderQuery, uploadImage, Create_Order2 } = require("../Controller/orderController");

router.get("/details", getOrderDetailsById);
router.get("/query", admin_Checker, orderQuery);
router.get("/clone", clone_Order);

router.post("/create", admin_Checker, upload.single('file'), Create_Order);
router.post("/upload", upload.single('file'), uploadImage);


// router.delete("/", admin_Checker, Delete_Client);
// router.get("/:Order_id", check_Logger, Single_Order);

router.get("/", admin_Checker, All_Order);

router.put("/", admin_Checker, Update_Order);

module.exports = router;

