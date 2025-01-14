const bcrypt = require("bcrypt")
const User = require("../model/userModel")
const generateTokenAndCookie = require("../middleware/generateToken&Cookies")
const errorHandler  = require("../utils/errorHandler")

const signUpController = async(req,res,next)=>{
    const {firstName,lastName,email,password,skills,gender,age} = req.body
    if( !firstName || !lastName|| !email || !password ||!skills ){
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
            lastName,
            email,
            password:hashedPassword, 
            skills,
            gender,
            age
        })
        await newUser.save();  
        const token = await generateTokenAndCookie(res,newUser._id)

        const {password:_ignored,...userDetails} = newUser._doc

        return res.status(201).json({ success:true, message:"User created" , user:userDetails })

    } catch (error) {
        return next(errorHandler(400,error.message))
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
     const token = generateTokenAndCookie(res,userExist._id)
     const {password:_ignored,...userDetails} = userExist._doc
     res.status(200).json({ success:true, message:"Login Success",user:userDetails})

    } catch (error) {
        return next(errorHandler(400,error.message))
    }
}

const logOutController = async(req,res)=>{
    res.cookie("token",null,{expiresIn:new Date(Date.now())})
    res.status(200).json({success:true, message:"Logout success"})
}


module.exports = {signInController,signUpController,logOutController}