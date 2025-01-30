const express =  require("express");
const {createOrderController, webHooksController} = require("../controller/paymentController");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router()

router.post("/createOrder",verifyUser, createOrderController);
router.post("/webhook",webHooksController);

module.exports = router;