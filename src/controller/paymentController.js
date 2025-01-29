const errorHandler = require("../utils/errorHandler");
const razorpayInstance = require("../utils/razorpay");

const createOrderController = async(req, res, next)=>{
    try {
        const order = await razorpayInstance.orders.create({
            amount: 50000,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
              firstName: "value3",
              lastName: "value2",
              membershipType:"gold"
            }
          })
          console.log(order);
           
          res.json({order})
          
    } catch (error) {
        console.error(error)
        next(errorHandler(400,error.message))
    }
}

module.exports = createOrderController;