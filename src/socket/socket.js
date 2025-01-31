const socket = require("socket.io");
const User = require("../model/userModel");
const crypto = require("crypto")

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
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
            console.error(error)
        }
    })

    socket.on("sendMessage", async ({ firstName , userId, targetUserId , text })=>{ 
        const roomId = getSecretRoomId( userId, targetUserId );
        io.to(roomId).emit("messageReceived", { firstName, text });  
    })

    socket.on("disconnect",()=>{})
  });
};

module.exports = { initializeSocket };
