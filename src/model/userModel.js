const mongoose = require("mongoose");
const USER_ICON = require("../utils/constants");

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
            required:true,
            minlength:[1,"Lastname must be atleast min-1 & max-20 char"],
            maxlength:[20,"Lastname must be atleast min-1 & max-20 char"],
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
        },
        age : {
            type:Number,
        },
        skills:{
            type:[String],
            required:true,
            validate:{
                validator: function(skills){
                    return skills.length >=1 && skills.length <=5
                },
                message:"Skills should include at least 1 and at most 5 items"
            }
            },

        gender:{
            type:String,
            validate (value){
                if(!["male","female","other"].includes(value)){
                    throw new Error("Gender must be one of male, female or other")
                }
            }
            ,
        },
        photoURL:{
            type:String,
            default:USER_ICON,
            required:true
        }    
    },
    {timestamps:true});

    userSchema.index({firstName:1})

const User = new mongoose.model("User",userSchema);

module.exports = User;