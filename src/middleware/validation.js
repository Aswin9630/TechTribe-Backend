const { validationResult,check } = require("express-validator")


const signUpValidation = ()=>[
    check("firstName","Firstname is required").isString(),
    check("email","Email is required").isEmail(),
    check("password")
        .isLength({min:8}).withMessage("Password must includes 8 or more characters")
        .matches(/[A-Z]/).withMessage("Password must includes atleast one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must includes atleast one number")
        .matches(/[!@#$%^&*(){}:"<>?,.|]/).withMessage("Password must includes atleast one special characters")

]


const signInValidation = ()=>[
    check("email","Email is required").isEmail(),
    check("password","password must include 8 or more characters").isLength({
        min:8
    }),
]


const handleValidationErrors = (req,res,next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({success:false,message:errors.array()})
    }
    next()
}


module.exports = {handleValidationErrors,signUpValidation,signInValidation}