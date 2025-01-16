const ConnectionRequest = require("../model/connectionRequestModel");
const User = require("../model/userModel");
const errorHandler = require("../utils/errorHandler");


const USER_SAFE_DATA= ["firstName","lastName","age","gender","skills"]

const receivedRequestController = async(req, res, next)=>{
    try {
        const { id } = req.user;
        const loggedInUser = await User.findById(id);

        const pendingReceivedRequest = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId" ,USER_SAFE_DATA); 

        if(!pendingReceivedRequest){
            return next(errorHandler(400,"something went wrong while fetching data to get pending request"))
        }

        const messages = pendingReceivedRequest.length===0 ? "No pending request" : "Fetched all pending request"

        res.status(200).json({ success:true, message:messages, data:pendingReceivedRequest })
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

const acceptedConnectionController = async (req,res,next)=>{
    try {
        const { id } = req.user;
        const loggedInUser = await User.findById(id);
        
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                { toUserId:loggedInUser._id , status:"accepted" },
                { fromUserId:loggedInUser._id , status:"accepted" },
            ]
        })
        .populate( "fromUserId", ["firstName","age","gender"] )
        .populate( "toUserId", ["firstName","age","gender"] )

       const data = connectionRequest.map((row)=>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
            return row.toUserId;
        }
            return row.fromUserId;
       })

        res.status(200).json({ success:true, message:"Successfully fetched all connections", data })


    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

const feedController = async(req,res,next)=>{
    try {
        const { id } = req.user;
        const loggedInUser = await User.findById(id);

        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id},
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString()),
            hideUsersFromFeed.add(req.toUserId.toString())
        })

        const users = await User.find({
            $and:[
                {_id: { $nin : Array.from(hideUsersFromFeed)}},
                {_id: {$ne:loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA)  
        

        res.status(200).json({ success:true, message:"successfully" , data:users });
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

module.exports = {receivedRequestController, acceptedConnectionController, feedController };