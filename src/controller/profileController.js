const User = require("../model/userModel");
const errorHandler = require("../utils/errorHandler");

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
    return next(errorHandler(500, error.message));
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

const updateUserProfilePassword = async (req, res, next) => {
  try {
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePassword,
};
