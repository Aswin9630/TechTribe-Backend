const express = require("express")
const verifyUser = require("../middleware/verifyUser")
const receivedRequestController = require("../controller/userRequestRecieivedController")
const router = express.Router()

router.get("/request/received", verifyUser, receivedRequestController)

 
module.exports = router