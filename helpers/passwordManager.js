const bcrypt = require("bcrypt");

// Helper function to hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

module.exports = {
  hashPassword,
};
