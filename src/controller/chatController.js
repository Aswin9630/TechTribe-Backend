const { Chat } = require("../model/chatSchema");
const errorHandler = require("../utils/errorHandler")

const getChatController = async(req,res,next)=>{
    const { targetUserId } = req.params;    
    const userId = req.user.id;

    try {
        let chat = await Chat.findOne({
            participants:{ $all: [ userId, targetUserId ]}
        }).populate({
            path:"message.senderId",
            select:"firstName lastName"
        })

        if(!chat){
          chat = new Chat({
            participants:[ userId, targetUserId ],
            message:[]
          })  
          await chat.save()
        }
        res.status(200).json({ chat })

    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

module.exports = { getChatController}