const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        firstName : {
            type:String,
            required:true,
            minlength:[4,"Firstname must be atleast min-4 & max-20 char"],
            maxlength:20
        },
        lastName : {
            type:String,
            minlength:[1,"Lastname must be atleast min-1 & max-20 char"],
            maxlength:20
        },
        email : {
            type:String,
            required:true,
            trim:true,
            unique:true,
        },
        password : {
            type:String,
            required:true,
            minlength:8
        },
        age : {
            type:Number,
            required:true
        },
        skills:{
            type:[String],
            default:[]
        },
        gender:{
            type:String,
            enum:{
                values:["men","women","other"],
                message:"Gender should be one of 'men'/'women'/'other'",
            },
        },    
    },
    {
        timestamps:true
    }
)

const User = new mongoose.model("user",userSchema);

module.exports = User;