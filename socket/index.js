const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/UserModel");
const app = express();

/***socket connection */

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});

/***
 * socket running at http://localhost:8081/
 */

// online user set
const onlineUser = new Set();
io.on("connection", async (socket) => {
  console.log("connect User ", socket.id);

  const token = socket.handshake?.auth?.token;

  //current user details
  const user = await getUserDetailsFromToken(token);
  const userID = user?.user?._id ?? "";
  console.log("users", userID);

  //create a room
  socket.join(userID?.toString());
  onlineUser.add(userID?.toString());

  // Get all online User
  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser.has(userId),
    };

    console.log("userDetails", userDetails);
    socket.emit("message-user", payload);
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log("disconnect user ", socket.id);
    onlineUser.delete(userID);
  });
});

module.exports = {
  app,
  server,
};
