const express = require("express");
const corsMiddleware = require("./config/cors");
const itemRoutes = require("./routes/itemRoutes");
const errorHandler = require("./middleware/errorHandler");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json());

// Routes
app.use("/api", itemRoutes, todoRoutes);

// Error handling (should be last)
app.use(errorHandler);

module.exports = app;
