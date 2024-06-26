const cors = require("cors");
const express = require("express");
require("dotenv").config();
const connectDB = require("./config/connectDB");
const userRoutes = require("./routes/index");
const { swaggerUi, swaggerSpec } = require("./swagger/swagger");

const { app, server } = require('./socket/index')
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// Middleware to parse JSON bodies
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

// const app = express();
app.use(express.json());
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
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss:
      ".swagger-ui .opblock .opblock-summary-path-description-wrapper { align-items: center; display: flex; flex-wrap: wrap; gap: 0 10px; padding: 0 5px; width: 100%; }",
    customCssUrl: CSS_URL,
  })
);

// API endpoints
app.use("/api/users", userRoutes);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("Server running at " + PORT);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
  });
