const cors = require("cors");
const express = require("express");
const app = express();
require("dotenv").config();
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/index");
app.use(express.json());
const { swaggerUi, swaggerSpec } = require("./swagger/swagger");
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// Middleware to parse JSON bodies
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

const corsOptions = {
  origin: "*",
  methods: "GET, POST, PUT, DELETE",
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8081;

app.get("/", (request, response) => {
  response.json({
    message: "Server running at " + PORT,
  });
});

// Serve Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// API endpoints
app.use("/api/users", userRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server running at " + PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
  });
