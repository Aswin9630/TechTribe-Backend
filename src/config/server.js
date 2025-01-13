const express = require("express");
const dotenv = require("dotenv")
const connectDB = require("./database")
dotenv.config()
const app= express()

const PORT = 3000 || process.env.PORT


const startServer = async()=>{

    try {
        await connectDB();
        app.listen(PORT,()=>console.log("Server running on port:"+PORT))

    } catch (error) {
        console.error("Error starting the server:", error.message);
        process.exit(1);
    }
}

module.exports = startServer;