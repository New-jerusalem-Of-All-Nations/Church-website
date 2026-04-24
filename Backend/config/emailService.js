const nodemailer = require("nodemailer");

// Configure your email service
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} catch (error) {
  console.warn("⚠️  Email service configuration error:", error.message);
  // Create a dummy transporter that logs instead of sending
  transporter = {
    sendMail: async (options) => {
      console.log("📧 Email would be sent:", options.subject);
      return { messageId: "dummy-id" };
    }
  };
}

/**
 * Send OTP via email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} name - User name
 */
const sendOTPEmail = async (email, otp, name = "User") => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #333; margin: 0;">New Jerusalem International Ministries</h1>
        </div>
        <div style="padding: 30px; background-color: #fff; border: 1px solid #ddd;">
          <p style="color: #555; font-size: 16px;">Hello <strong>${name}</strong>,</p>
          
          <p style="color: #555; font-size: 14px;">You requested a login token for your account. Your verification code is:</p>
          
          <div style="background-color: #007bff; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <p style="color: #fff; font-size: 32px; font-weight: bold; margin: 0; letter-spacing: 5px;">${otp}</p>
          </div>
          
          <p style="color: #555; font-size: 14px;">This code will expire in <strong>15 minutes</strong>.</p>
          
          <p style="color: #555; font-size: 14px;">
            <strong>Important:</strong> Do not share this code with anyone. Our team will never ask for your code.
          </p>
          
          <p style="color: #555; font-size: 12px; margin-top: 30px;">
            If you didn't request this code, please ignore this email or contact support immediately.
          </p>
        </div>
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
          <p style="margin: 0;">© 2026 New Jerusalem International Ministries. All rights reserved.</p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Login Verification Code - New Jerusalem International Ministries",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "OTP sent successfully" };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send OTP email");
  }
};

/**
 * Send password reset email
 */
const sendPasswordResetEmail = async (email, resetLink, name = "User") => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #333; margin: 0;">New Jerusalem International Ministries</h1>
        </div>
        <div style="padding: 30px; background-color: #fff; border: 1px solid #ddd;">
          <p style="color: #555; font-size: 16px;">Hello <strong>${name}</strong>,</p>
          
          <p style="color: #555; font-size: 14px;">You requested a password reset. Click the link below to reset your password:</p>
          
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
          </div>
          
          <p style="color: #555; font-size: 14px;">This link will expire in <strong>1 hour</strong>.</p>
          
          <p style="color: #555; font-size: 12px; margin-top: 30px;">
            If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request - New Jerusalem International Ministries",
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Password reset email sent" };
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = {
  sendOTPEmail,
  sendPasswordResetEmail,
  transporter,
};
