const errorHandler = require("../utils/errorHandler")

const sendConnectionRequestController = async(req,res,next)=>{
    try {
        const user = req.user;
        res.send(`${user.firstName} send the connection`);
    } catch (error) {
        return next(errorHandler(500,error.message))
    }
}

module.exports = sendConnectionRequestController;