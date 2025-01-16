const mongoose = require("mongoose")

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["accepted","rejected","interested","ignored"],
            message:`{VALUES} is not a valid status type`,
        }
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;