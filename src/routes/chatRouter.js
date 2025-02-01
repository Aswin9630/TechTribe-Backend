const express = require("express")
const { getChatController } = require("../controller/chatController")
const verifyUser = require("../middleware/verifyUser")
const router = express.Router()

router.get("/:targetUserId",verifyUser,getChatController)

module.exports  = router