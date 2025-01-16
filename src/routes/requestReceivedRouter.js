const express = require("express")
const verifyUser = require("../middleware/verifyUser")
const {receivedRequestController, acceptedConnectionController} = require("../controller/userRequestRecieivedController")
const router = express.Router()

router.get("/request/received", verifyUser, receivedRequestController );
router.get("/connections", verifyUser, acceptedConnectionController );
 
module.exports = router