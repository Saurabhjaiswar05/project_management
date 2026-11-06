require("dotenv").config();

const express = require("express");
const sequelize = require("./config/mysql");
const connectMongoDB = require("./config/mongodb");
require("./models/mysql/associations");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);


app.use((err, req, res, next) => {
    return res.status(err.statusCode || err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

app.listen(process.env.PORT, async () => {
  try {
    // MySQL connection
    await sequelize.authenticate();
    console.log("MySQL connected successfully");

    // Create MySQL tables
    await sequelize.sync();
    console.log("MySQL tables synchronized");

    // MongoDB connection
    await connectMongoDB();
    console.log("MongoDB connected successfully");

    console.log("Server is running on port", process.env.PORT);
  } catch (error) {
    console.log("Database connection failed:", error.message);
  }
});
