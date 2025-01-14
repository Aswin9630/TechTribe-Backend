const express = require("express")
const verifyUser = require("../middleware/verifyUser")
const sendConnectionRequestController = require("../controller/requestController")
const router = express.Router()

router.post("/send/:status/:toUserId",verifyUser,sendConnectionRequestController)

 
module.exports = router