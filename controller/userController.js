const mongoose = require("mongoose");
const UserModel = require("../models/UserModel");
const { uploadImage } = require("../helpers/uploadImages");
const { hashPassword } = require("../helpers/passwordManager");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register New User
async function registerUser(request, response) {
  try {
    if (!request.file) {
      return response.status(400).json({ error: "No image file provided" });
    }
    // Upload the image to ImageKit
    const imageResult = await uploadImage(request.file);

    // Check if the email already exists in the database
    const existingUser = await UserModel.findOne({
      email: request.body.email,
    }).exec();
    if (existingUser) {
      return response
        .status(409)
        .json({ status: 409, message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await hashPassword(request.body.password);

    // Create new user data
    const newUser = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      name: request.body.name,
      email: request.body.email,
      password: hashedPassword,
      profile_pic: imageResult.url,
    });

    // Save the user to the database
    const result = await newUser.save();
    response.status(200).json({
      success: true,
      status: 200,
      message: "Registration Completed",
      usersdata: result,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

// Login New Users
async function loginUser(request, response) {
  try {
    // Find user by email
    const user = await UserModel.findOne({ email: request.body.email }).exec();

    if (!user) {
      return response.status(200).json({
        message: "User Not found",
      });
    }

    // Compare the provided password with the hashed password in the database
    const match = await bcrypt.compare(request.body.password, user.password);

    if (!match) {
      return response.status(200).json({
        message: "Password not Matched..Please try Again",
      });
    }

    // Generate JWT token if password matches
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
      },
      "LOGIN_TOKEN_CHAT_APP",
      { expiresIn: "24h" }
    );

    response.status(200).json({
      status: 200,
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
      },
      token: token,
    });
  } catch (error) {
    response.status(500).json({
      message: "Login Failed..Please Try After Some Times",
      error: error.message || error,
    });
  }
}

// Function to find user profile details based on token
async function getUserProfile(request, response) {
  try {
    const userId = request.user._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return response
        .status(500)
        .json({ status: 500, message: "User not found" });
    }

    response.status(200).json({
      status: 200,
      success: true,
      message: "User profile details retrieved successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    response.status(500).json({
      status: 500,
      message: "Error retrieving user profile details",
      error: error.message || error,
    });
  }
}


async function deleteUser(request, response) {
  try {
    const userId = request.params.userId;
    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return response
        .status(500)
        .json({ status: 500, message: "User not found" });
    }

    response.status(200).json({
      status: 200,
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    response.status(500).json({
      status: 500,
      message: "Error deleting user",
      error: error.message || error,
    });
  }
}



module.exports = { registerUser, loginUser, getUserProfile, deleteUser };
