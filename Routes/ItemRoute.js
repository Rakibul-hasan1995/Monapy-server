const router = require("express").Router();
const multer = require('multer');

const check_Logger = require("../Middleware/check_Logger");
const admin_Checker = require("../Middleware/admin_Checker");

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'public/item_img')
   },
   filename: function (req, file, cb) {
      let extArray = file.mimetype.split("/")
      let extension = extArray[extArray.length - 1]
      cb(null, `${req.body.style}-${randomString(5)}.${extension}`)
   }
})

var upload = multer({ storage: storage })

const {
   Create_Item, All_item, Delete_item, Update_item

} = require("../Controller/ItemController");

router.get("/", admin_Checker, All_item);
router.post("/create",  upload.single('file'), Create_Item);
router.delete("/delete", check_Logger, Delete_item);
router.put("/", check_Logger, Update_item);

module.exports = router;
