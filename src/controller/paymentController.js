const PaymentModel = require("../model/paymentModel");
const User = require("../model/userModel");
const errorHandler = require("../utils/errorHandler");
const razorpayInstance = require("../utils/razorpay");

const createOrderController = async(req, res, next)=>{
    const {memebershipType} = req.body;
    const {id} = req.user
    const user = await User.findById(id);
    try {
        const order = await razorpayInstance.orders.create({
            amount: 50000,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
              firstName:user.firstName,
              lastName: user.lastName,
              email:user.email,
              membershipType:memebershipType
            }
          })
          const payment = new PaymentModel({
            userId:id,
            orderId:order.id,
            amount:order.amount,
            currency:order.currency,
            status:order.status,
            notes:order.notes,
            receipt:order.receipt
          })     
          const savedPaymentDetails = await payment.save()
          const {...paymentDetails} = savedPaymentDetails._doc
          res.status(200).json({paymentDetails}) 
          
    } catch (error) {
        console.error(error)
        next(errorHandler(400,error.message))
    }
}

module.exports = createOrderController;