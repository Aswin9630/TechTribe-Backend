const socket = require("socket.io");
const User = require("../model/userModel");
const crypto = require("crypto");
const { Chat } = require("../model/chatSchema");

const initializeSocket = (server) => {
  
  const io = socket(server, {
    cors: {
      origin: process.env.NODE_ENV === "development" ? process.env.FRONTEND_URL : process.env.PRODUCTION_FRONTEND_URL
    },
    path: "/api/socket.io",
    withCredentials:true
  });

 const getSecretRoomId = ( userId, targetUserId )=>{
    return crypto.createHash("sha256").update([userId,targetUserId].sort().join("_")).digest("hex");
 }
 
  io.on("connection", (socket) => {

    socket.on("join", async({ firstName, userId, targetUserId })=>{ 
        const roomId = getSecretRoomId( userId, targetUserId );
        socket.join(roomId)  ;
        try {
            const targetUserDetails = await User.findById(targetUserId).select("firstName lastName email photoURL designation");
            socket.emit("targetUserDetails", { targetUserDetails });
        } catch (error) {
            console.error(error.message)
        }
    })
 
    socket.on("sendMessage",  async({ firstName , userId, targetUserId , text })=>{ 
      try{
          const roomId = getSecretRoomId( userId, targetUserId );
 
          let chat = await Chat.findOne({
            participants: { $all:[ userId, targetUserId ]}
          });
          
          if(!chat){
            chat = new Chat({
              participants:[ userId, targetUserId ],
              message:[]
            })
          }

          chat.message.push({
            senderId:userId,
            text
          })

          await chat.save()

        io.to(roomId).emit("messageReceived", { firstName, text });  

        }catch(err){
          console.error(err.message)
        }
    })

    socket.on("disconnect",()=>{})
  });
};

module.exports = { initializeSocket };
