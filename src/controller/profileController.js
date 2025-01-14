const User = require("../model/userModel");
const errorHandler = require("../utils/errorHandler");
const validateEditProfileData = require("../utils/updatevalidation");

const getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(401, "User not found"));
    }
    const { password: _ignored, ...userDetails } = user._doc;
    res.status(200).json({ userInfo: userDetails });
  } catch (error) {
    return next(errorHandler(400, error.message));
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    if(!validateEditProfileData(req)){
      throw new Error("invalid field edit request: email or password")
    }
    const { id } = req.user;
    const loggedInUser = await User.findById(id);
 
    Object.keys(req.body).forEach( (key) => ( loggedInUser[key]=req.body[key] ));
   await loggedInUser.save()

   const {password:_ignored,...userData} = loggedInUser._doc
  
   res.status(200).json({success:true, message:`${loggedInUser.firstName} , your profile is updated successfully`, data:userData})

  } catch (error) {
    return next(errorHandler(400, error.message));
  }
};

const updateUserProfilePassword = async (req, res, next) => {
  try {
  } catch (error) {
    return next(errorHandler(400, error.message));
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePassword,
};
