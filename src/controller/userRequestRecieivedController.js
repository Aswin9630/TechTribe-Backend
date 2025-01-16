const ConnectionRequest = require("../model/connectionRequestModel");
const User = require("../model/userModel");
const errorHandler = require("../utils/errorHandler");

const receivedRequestController = async(req, res, next)=>{
    try {
        const { id } = req.user;
        const loggedInUser = await User.findById(id);

        const pendingReceivedRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId" ,["firstName","lastName","age","gender"]); 

        if(!pendingReceivedRequest){
            return next(errorHandler(400,"something went wrong while fetching data to get pending request"))
        }

        const messages = pendingReceivedRequest.length===0 ? "No pending request" : "Fetched all pending request"

        res.status(200).json({ success:true, message:messages, data:pendingReceivedRequest })
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

module.exports = receivedRequestController;