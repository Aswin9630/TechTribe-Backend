const express =  require("express");
const createOrderController = require("../controller/paymentController");
const verifyUser = require("../middleware/verifyUser");
const router = express.Router()

router.post("/createOrder",verifyUser, createOrderController);

module.exports = router;