const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  deleteUser,
} = require("../controller/userController");
const { upload } = require("../helpers/uploadImages");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();
// Register

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with the provided details and profile picture
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: name
 *         in: formData
 *         description: The name of the user
 *         required: true
 *         type: string
 *       - name: email
 *         in: formData
 *         description: The email address of the user
 *         required: true
 *         type: string
 *         format: email
 *       - name: password
 *         in: formData
 *         description: The password of the user
 *         required: true
 *         type: string
 *         format: password
 *       - name: profile_pic
 *         in: formData
 *         description: The profile picture of the user
 *         required: true
 *         type: file
 *     responses:
 *       '200':
 *         description: Registration successful
 *       '400':
 *         description: Invalid input
 */

// Login
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Logs in a user
 *     description: Authenticates a user by their email and password.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user
 *                 required: true
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The user's password
 *                 required: true
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad request if parameters are not valid
 *       404:
 *         description: User not found
 */

// Profile API
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve user profile details based on authentication token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 *       '401':
 *         description: Unauthorized - Token not provided or invalid
 *       '500':
 *         description: Error retrieving user profile
 *     securitySchemes:
 *       BearerAuth:
 *         type: http
 *         scheme: bearer
 *         bearerFormat: JWT
 */

// ================================== All Routes  ==================================
// Register Users API Routes
router.post("/register", upload.single("profile_pic"), registerUser);
// Login Route
router.post("/login", loginUser);
// Profile get Route
router.get("/profile", authenticateToken, getUserProfile);
// Profile Delete Route
router.post("/profile/delete/:userId", authenticateToken, deleteUser);

module.exports = router;
