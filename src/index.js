const express = require("express");
const dotenv = require("dotenv")
const startServer = require("./config/server")
dotenv.config()
const app= express()


app.use("/",(req,res)=>{
    res.send("testing")
})

startServer()