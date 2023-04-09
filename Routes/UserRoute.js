const router = require("express").Router();

const check_logger = require("../Middleware/check_Logger");
const admin_Checker = require("../Middleware/admin_Checker");


const {
   All_user, Create_User, Delete_User, Update_User, User_login, User_logout, User_Check_log

} = require("../Controller/userController");

router.get("/",  admin_Checker, All_user);

router.post("/create", Create_User);

router.delete("/", admin_Checker, Delete_User);

router.put("/", check_logger, Update_User);

router.post("/login", User_login);

router.post("/logout", check_logger, User_logout);
router.get("/check/token", check_logger, User_Check_log);

module.exports = router;
