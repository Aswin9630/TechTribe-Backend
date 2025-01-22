const { validationResult,check } = require("express-validator")


const signUpValidation = ()=>[    
    check("firstName","Firstname is required").isString(),
    check("lastName","Lastname is required").isString(),
    check("email","Email is required").isEmail(),
    check("password")
        .isLength({ min:8 , max:20 }).withMessage("Password must be between 8 and 20 characters")
        .matches(/[A-Z]/).withMessage("Password must includes atleast one uppercase letter")
        .matches(/[a-z]/).withMessage("Password must includes atleast one number")
        .matches(/[!@#$%^&*(){}:"<>?,.|]/).withMessage("Password must includes atleast one special characters"),
    check("skills","required min 1 & max-5 skills"),
    check("designation","Please provide your Designation")
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