const errorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken")

const verifyUser = async(req,res,next)=>{
    const cookieToken = req.cookies.token
    if(!cookieToken){
        return next(errorHandler(401,"Unauthorized access"))
    }
    try {
            jwt.verify(cookieToken,process.env.ACCESS_TOKEN_SECRET_KEY, (err,decoded)=>{
            if(err){
                if (err.name === "TokenExpiredError") {
                    return next(errorHandler(403, "Token has expired. Please log in again."));
                }
                if (err.name === "JsonWebTokenError") {
                    return next(errorHandler(403, "Invalid token."));
                }
                return next(errorHandler(500,"Token verification failed"))
            }
            req.user = decoded;
            next()
        })
    } catch (error) {
        return next(errorHandler(500,error.message))
    }
}

module.exports = verifyUser