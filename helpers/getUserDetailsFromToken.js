const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      message: "Session expired",
      logout: true,
    };
  }
  try {
    const decoded = await jwt.verify(token, "LOGIN_TOKEN_CHAT_APP");
    const user = await UserModel.findById(decoded._id).select("-password");
    if (!user) {
      return {
        message: "User not found",
        logout: true,
      };
    }
    return {
      success: true,
      user: user,
    };
  } catch (error) {
    return {
      message: "Invalid token",
      logout: true,
    };
  }
};

module.exports = getUserDetailsFromToken;
