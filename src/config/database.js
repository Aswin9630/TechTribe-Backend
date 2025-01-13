const mongoose = require("mongoose")

const connectDb = async(req,res,next)=>{
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in the environment variables.");
        }
        await mongoose.connect(process.env.MONGODB_URL) ;
        console.log("connected to database")
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
        next(error)
    }
   
}

module.exports = connectDb;