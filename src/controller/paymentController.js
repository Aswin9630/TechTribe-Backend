const PaymentModel = require("../model/paymentModel");
const User = require("../model/userModel");
const { MEMBERSHIPAMOUNT, CURRENCY } = require("../utils/constants");
const errorHandler = require("../utils/errorHandler");
const razorpayInstance = require("../utils/razorpay");
const {validateWebhookSignature} = require("razorpay/dist/utils/razorpay-utils")

const createOrderController = async(req, res, next)=>{
    const {membershipType} = req.body;
    const {id} = req.user
    const user = await User.findById(id);
    try {
        const order = await razorpayInstance.orders.create({
            amount: MEMBERSHIPAMOUNT[membershipType] * 100,
            currency: CURRENCY,
            receipt: "receipt#1",
            notes: {
              firstName:user.firstName,
              lastName: user.lastName,
              email:user.email,
              membershipType:membershipType
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
          res.status(200).json({ paymentDetails, keyId:process.env.RAZORPAY_KEY_ID }) 
          
    } catch (error) {
        console.error(error)
        return next(errorHandler(400,error.message))
    }
}

const webHooksController = async(req,res,next)=>{
  try {

    const webhookSignature = req.headers["x-razorpay-signature"]; 
    const isWebhookValid = validateWebhookSignature(req.body, webhookSignature, process.env.RAZORPAY_WEBHOOK_SECRET)
    if(!isWebhookValid){
      return next(errorHandler(400,"Webhook Signature is not valid"))
    }

    const paymentDetails = req.body.payload.payment.entity;
    const payment = await PaymentModel.findOne({orderId:paymentDetails.order._id})
    if (!payment) {
      return next(errorHandler(400,"Payment record not found"));
  }
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findById(payment.userId);
    if(!user){
      return next(errorHandler(400,"User not found"));
    }
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;
    await user.save();

    return res.status(200).json({mes:"Webhook received successfully"})
  } catch (error) {
    console.error(error)
    return next(errorHandler(400, error.message))
  }
}

module.exports = {createOrderController,webHooksController};