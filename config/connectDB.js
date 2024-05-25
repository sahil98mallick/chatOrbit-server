const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://sahilmallick:sahilmallick9635@sahilmallick.yawwcxk.mongodb.net/?retryWrites=true&w=majority"
    );
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Connected to DB");
    });

    connection.on("error", (error) => {
      console.log("Something went wrong with MongoDB", error);
    });
  } catch (error) {
    console.log("Database connection error", error);
  }
}

module.exports = connectDB;
