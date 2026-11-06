
const express = require("express");
const loginLimiter = require("../middlewares/rateLimiter");
const router = express.Router();

const {
    register,
    login,
    getMe,
    updateProfile
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");


// Public routes
router.post("/register", register);
router.post("/login", loginLimiter,login);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
