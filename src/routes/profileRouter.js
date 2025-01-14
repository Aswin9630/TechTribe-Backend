const express = require("express")
const verifyUser = require("../middleware/verifyUser")
const { getUserProfile, updateUserProfile } = require("../controller/profileController")
const router = express.Router()

router.get("/view",verifyUser,getUserProfile)
router.patch("/update",verifyUser,updateUserProfile)


module.exports = router