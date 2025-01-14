const express = require("express")
const verifyUser = require("../middleware/verifyUser")
const { getUserProfile, updateUserProfile, updateUserProfilePassword } = require("../controller/profileController")
const router = express.Router()

router.get("/view",verifyUser,getUserProfile)
router.patch("/update",verifyUser,updateUserProfile)
router.patch("/update/password",verifyUser,updateUserProfilePassword)


module.exports = router