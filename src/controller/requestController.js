const ConnectionRequest = require("../model/connectionRequestModel");
const User = require("../model/userModel");
const errorHandler = require("../utils/errorHandler")
const sendEmail = require("../utils/sendEmail")

const sendConnectionRequestController = async(req,res,next)=>{
    try {
        const {id} = req.user;
        const user = await User.findById(id)

        const fromUserId = user._id; 
        const toUserId = req.params.toUserId
        const status = req.params.status

        //while requesting connection, it should allow only certain Status-Types
        const allowedStatus = ["interested","ignored"];
        if(!allowedStatus.includes(status)){
            return next(errorHandler(400,`${status.toUpperCase()} is Invalid status type`))
        }

        const toUser = await User.findById(toUserId)
        if(!toUser){
            return next(errorHandler(404,"User not found"));
        }

        const isConnectionRequestExist = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })
        if(isConnectionRequestExist){
            return next(errorHandler(400,"Connection request already exist!"))
        }       

        const newConnectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await newConnectionRequest.save();
        if(newConnectionRequest.status==="interested"){

            const emailResponse =await sendEmail.run(`${user.firstName} send a connection request to ${toUser.firstName}`)
        }

        res.status(200).json({ success:true, message:`${user.firstName.toUpperCase()} is ${status} in ${toUser.firstName}`, connectionDetails:data })
         
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

const reviewConnectionRequestController = async(req,res,next)=>{
    try {
        const { id } = req.user;
        const loggedInUser = await User.findById(id)
        const { status, requestId } = req.params

        const allowedStatus = ["accepted","rejected"]
        if(!allowedStatus.includes(status)){
            return next(errorHandler(400,"Status is not valid"))
        }

        const isConnectionRequestExist = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested"
        })
        if(!isConnectionRequestExist){
            return next(errorHandler(404,"Request not found"))
        }

        if(ConnectionRequest.fromUserId===loggedInUser._id){
            return next(errorHandler(400,"Oops..!!! You cannot send request to yourself"))
        }

         isConnectionRequestExist.status = status;
         const data = await isConnectionRequestExist.save()

         res.status(200).json({ success:true, message:`connection request ${status}`, data})

        
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

module.exports = {sendConnectionRequestController, reviewConnectionRequestController};