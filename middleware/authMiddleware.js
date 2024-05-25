const jwt = require("jsonwebtoken");

// Middleware to extract and verify JWT token
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response
      .status(401)
      .json({ message: "Unauthorized: Missing or invalid token" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "LOGIN_TOKEN_CHAT_APP", (error, decodedToken) => {
    if (error) {
      return response.status(403).json({ message: "Forbidden: Invalid token" });
    }
    request.user = decodedToken;
    next();
  });
};

module.exports = { authenticateToken };
