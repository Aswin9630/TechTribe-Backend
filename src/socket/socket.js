const socket = require("socket.io");
const User = require("../model/userModel");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
    },
  });
 
  io.on("connection", (socket) => {

    socket.on("join", async({ firstName, userId, targetUserId })=>{ 
        const roomId = [userId,targetUserId].sort().join("_");
        socket.join(roomId)  ;
        try {
            const targetUserDetails = await User.findById(targetUserId).select("firstName lastName email photoURL designation");
            socket.emit("targetUserDetails", { targetUserDetails });
        } catch (error) {
            console.error(error)
        }
    })

    socket.on("sendMessage", async ({ firstName , userId, targetUserId , text })=>{ 
        const roomId = [userId,targetUserId].sort().join("_");
        io.to(roomId).emit("messageReceived", { firstName, text });  
    })

    socket.on("disconnect",()=>{})
  });
};

module.exports = { initializeSocket };
