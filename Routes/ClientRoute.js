const router = require("express").Router();

const check_Logger = require("../Middleware/check_Logger");
const admin_Checker = require("../Middleware/admin_Checker");

const {
   Create_client, All_client, Update_Client, Delete_Client, Single_client, 
} = require("../Controller/clientController");


//  get-->> /client for #admin 
router.get("/", admin_Checker, All_client);
router.get("/:client_id", admin_Checker, Single_client);

router.post("/create", admin_Checker, Create_client);

router.delete("/", admin_Checker, Delete_Client);

router.put("/", admin_Checker, Update_Client);

module.exports = router;
