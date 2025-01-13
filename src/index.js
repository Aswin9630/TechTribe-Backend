const express = require("express");
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
dotenv.config();
const authRouter = require("./routes/authRouter")
const profileRouter = require("./routes/profileRouter")
const connectDB = require("./config/database")
const PORT = process.env.PORT
const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/auth",authRouter)
app.use("/user",profileRouter)


const serverAndDBconnect = async()=>{
  
  try {
      await connectDB();
      app.listen(PORT,()=>console.log("Server running on port:"+PORT))
      
  } catch (error) {
      console.error("Failed to connect to DB or start server:", error.message);
      process.exit(1);
    }
  }
serverAndDBconnect();

  app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal server error";
    return res.status(statusCode).json({ success: false, message });
  });