const express =  require("express");
const {createOrderController, webHooksController, paymentVerify} = require("../controller/paymentController");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router()

router.post("/createOrder",verifyUser, createOrderController);
router.post("/webhook",webHooksController);
router.get("/premium/verify",verifyUser,paymentVerify)

module.exports = router;