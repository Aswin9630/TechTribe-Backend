const express = require("express")
const { signUpController, signInController } = require("../controller/authController")
const {handleValidationErrors, signUpValidation, signInValidation} = require("../middleware/validation")
const router = express.Router()

router.post("/signup",signUpValidation(),handleValidationErrors,signUpController)
router.post("/signin",signInValidation(),handleValidationErrors,signInController)


module.exports = router