const bcrypt = require("bcrypt")
const User = require("../model/userModel")
const setTokenAndCookie = require("../middleware/setToken&Cookies")
const errorHandler  = require("../utils/errorHandler")

const signUpController = async(req,res,next)=>{
    const {firstName,email,password} = req.body
    if( !firstName || !email || !password ){
        return next(errorHandler(400,"All fields are required"))
    }
    try {
        const emailExist = await User.findOne({email})
        if(emailExist){
            return next(errorHandler(400,"Email already exist"))
        }

        const hashedPassword = await bcrypt.hash( password , 10 ) 
        const newUser = new User({
            firstName,
            email,
            password:hashedPassword
        })
        await newUser.save();  
        const token = await setTokenAndCookie(res,newUser._id)

        const {password:_ignored,...userDetails} = newUser._doc

        return res.status(201).json({ success:true, message:"User created" , user:userDetails })

    } catch (error) {
        return next(errorHandler(500,error.message))
    }   
}


const signInController = async(req,res,next)=>{
    const {email,password} = req.body
    if( !email || !password ){
        return next(errorHandler(400,"All fields are required"))
    }
    try {
     const userExist = await User.findOne({email});
     if(!userExist){
        return next(errorHandler(401,"User not found"))
     }
     comparePassword = await bcrypt.compare(password,userExist.password)
     if(!comparePassword){
        return next(errorHandler(401,"incorrect credentials"));
     }
     const token = setTokenAndCookie(res,userExist._id)
     const {password:_ignored,...userDetails} = userExist._doc
     res.status(200).json({ success:true, message:"Login Success",user:userDetails})

    } catch (error) {
        return next(errorHandler(500,error.message))
    }
}

module.exports = {signInController,signUpController}