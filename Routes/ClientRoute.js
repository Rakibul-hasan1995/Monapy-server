const router = require("express").Router();

const check_Logger = require("../Middleware/check_Logger");
const admin_Checker = require("../Middleware/admin_Checker");

const {
   Create_client, All_client, Update_Client, Delete_Client, getTopClients, getStatement,
} = require("../Controller/clientController");

//  get-->> top clients for #admin 
router.get("/statement/:_id", admin_Checker, getStatement);
//  get-->> top clients for #admin 
router.get("/top-clients", admin_Checker, getTopClients);

//  get-->> /clients for #admin 
router.get("/", admin_Checker, All_client);

//  get-->> create Clients for #user 
router.post("/", admin_Checker, Create_client);

//  get-->> create Clients for #admin 
router.delete("/", admin_Checker, Delete_Client);

//  get-->> create Clients for #admin 
router.put("/", admin_Checker, Update_Client);

module.exports = router;
