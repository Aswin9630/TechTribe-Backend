const express = require("express")
const verifyUser = require("../middleware/verifyUser")
const {receivedRequestController, acceptedConnectionController, feedController} = require("../controller/userRequestRecieivedController")
const router = express.Router()

router.get("/request/received", verifyUser, receivedRequestController );
router.get("/connections", verifyUser, acceptedConnectionController );
router.get("/feed", verifyUser, feedController );
 
module.exports = router  