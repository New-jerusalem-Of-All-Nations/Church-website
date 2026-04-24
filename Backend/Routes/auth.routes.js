const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../Models/userModels");
const OTP = require("../Models/otpModels");
const { sendOTPEmail, sendPasswordResetEmail } = require("../config/emailService");
const auth = require("../middleware/auth");

const router = express.Router();

// ============================================
// TWO-FACTOR AUTHENTICATION ENDPOINTS
// ============================================

/**
 * REQUEST LOGIN TOKEN
 * Generates OTP and sends via email
 * Now also validates password for extra security
 */
router.post("/request-login-token", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Generate session ID (use tokenId as sessionId)
    const sessionId = crypto.randomBytes(16).toString("hex");

    // Set expiration to 15 minutes
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase().trim() });

    // Save OTP to database
    const otpRecord = await OTP.create({
      email: email.toLowerCase().trim(),
      token: sessionId,
      otp,
      type: "login",
      expiresAt,
    });

    // Send OTP via email
    await sendOTPEmail(email, otp, user.name);

    // FIXED: Return sessionId at top level
    res.status(200).json({
      success: true,
      sessionId: sessionId,  // ← TOP LEVEL, not nested in data
      message: "Verification code sent to your email",
      expiresIn: 900, // seconds
    });
  } catch (error) {
    console.error("Request login token error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send verification code",
      error: error.message,
    });
  }
});

/**
 * VERIFY LOGIN TOKEN (OTP VERIFICATION)
 * Verifies OTP and returns JWT token
 */
router.post("/verify-login-token", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase().trim(),
      otp: otp.toString(),
      type: "login",
      isUsed: false,
    });

    if (!otpRecord) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Mark OTP as used
    otpRecord.isUsed = true;
    otpRecord.usedAt = new Date();
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Verify login token error:", error);
    res.status(500).json({
      success: false,
      message: "Token verification failed",
      error: error.message,
    });
  }
});

// ============================================
// TRADITIONAL LOGIN ENDPOINT (Optional)
// ============================================

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Auth login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// ============================================
// PASSWORD RESET ENDPOINTS
// ============================================

/**
 * REQUEST PASSWORD RESET
 */
router.post("/request-password-reset", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token
    await OTP.create({
      email: email.toLowerCase().trim(),
      token: resetToken,
      otp: resetToken, // Use token as OTP
      type: "password-reset",
      expiresAt,
    });

    // Create reset link
    const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password?token=${resetToken}&email=${email}`;

    // Send email
    await sendPasswordResetEmail(email, resetLink, user.name);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Request password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process password reset request",
      error: error.message,
    });
  }
});

/**
 * VERIFY PASSWORD RESET TOKEN
 */
router.post("/verify-reset-token", async (req, res) => {
  const { email, token } = req.body;

  if (!email || !token) {
    return res.status(400).json({
      success: false,
      message: "Email and token are required",
    });
  }

  try {
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase().trim(),
      token: token,
      type: "password-reset",
      isUsed: false,
    });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token is valid",
      data: { email, tokenId: otpRecord._id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Token verification failed",
    });
  }
});

/**
 * RESET PASSWORD
 */
router.post("/reset-password", async (req, res) => {
  const { email, token, newPassword, confirmPassword } = req.body;

  if (!email || !token || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  try {
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otpRecord = await OTP.findOne({
      email: email.toLowerCase().trim(),
      token: token,
      type: "password-reset",
      isUsed: false,
    });

    if (!otpRecord) {
      return res.status(404).json({
        success: false,
        message: "Invalid reset token",
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Mark token as used
    otpRecord.isUsed = true;
    otpRecord.usedAt = new Date();
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message,
    });
  }
});

// ============================================
// PROTECTED ENDPOINTS
// ============================================

/**
 * GET CURRENT USER INFO
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * LOGOUT (Client-side token deletion, can log activity)
 */
router.post("/logout", auth, (req, res) => {
  // Token invalidation logic can be added here (e.g., blacklist token)
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = router;
