const ConnectionRequest = require("../model/connectionRequestModel");
const User = require("../model/userModel");
const errorHandler = require("../utils/errorHandler")

const sendConnectionRequestController = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const user = await User.findById(id)

        const fromUserId = user._id;
        const toUserId = req.params.toUserId
        const status = req.params.status

        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await newConnectionRequest.save()
        res.status(200).json({ success:true, message:`${user.firstName.toUpperCase()} send the Request`, connectionDetails:data })
         
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

module.exports = sendConnectionRequestController;