const express = require("express")
const verifyUser = require("../middleware/verifyUser")
const {sendConnectionRequestController, reviewConnectionRequestController} = require("../controller/requestController")
const router = express.Router()

router.post("/send/:status/:toUserId", verifyUser, sendConnectionRequestController)
router.post("/review/:status/:requestId", verifyUser, reviewConnectionRequestController)

 
module.exports = router