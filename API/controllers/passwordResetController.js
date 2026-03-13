import { db } from "../database/db.js";
import { sendEmailLogic } from "../service/mailService.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Request password reset - sends email with reset link
export const requestReset = async (req, res) => {
  const { email, userType } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const type = userType || "user";
    const table = type === "blood_bank" ? "blood_banks" : "users";

    // Check if user/bank exists
    const account = await db.get(`SELECT id, name, email FROM ${table} WHERE email = ?`, [email]);
    if (!account) {
      // Don't reveal if email exists — always show success
      return res.status(200).json({ message: "If this email exists, a reset link has been sent." });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString("hex");

    // Delete any existing tokens for this email
    await db.run("DELETE FROM password_resets WHERE email = ?", [email]);

    // Save the new token
    await db.run(
      "INSERT INTO password_resets (email, token, user_type) VALUES (?, ?, ?)",
      [email, token, type]
    );

    // Build the reset link (frontend URL)
    const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${encodeURIComponent(email)}&type=${type}`;

    // Send email
    await sendEmailLogic({
      to: email,
      subject: "🔐 Password Reset - Blood Bank System",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #dc3545; text-align: center;">🩸 Blood Bank System</h2>
          <hr style="border: 1px solid #dc3545;">
          <p>Hello <strong>${account.name}</strong>,</p>
          <p>We received a password reset request for your account. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-size: 16px;">
              Reset My Password
            </a>
          </div>
          <p style="color: #666; font-size: 13px;">This link expires in <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
          <hr>
          <p style="color: #999; font-size: 12px; text-align: center;">Blood Bank Management System © 2026</p>
        </div>
      `,
      senderName: "Blood Bank System",
    });

    res.status(200).json({ message: "If this email exists, a reset link has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Actually reset the password
export const resetPassword = async (req, res) => {
  const { email, token, newPassword, userType } = req.body;

  if (!email || !token || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 3) {
    return res.status(400).json({ message: "Password must be at least 3 characters" });
  }

  try {
    const type = userType || "user";

    // Find the token
    const resetRecord = await db.get(
      "SELECT * FROM password_resets WHERE email = ? AND token = ? AND user_type = ?",
      [email, token, type]
    );

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired reset link" });
    }

    // Check if the token is older than 15 minutes
    // SQLite CURRENT_TIMESTAMP is UTC, append 'Z' to parse as UTC
    const createdAt = new Date(resetRecord.created_at + "Z");
    const now = Date.now();
    const diffMinutes = (now - createdAt.getTime()) / (1000 * 60);
    if (diffMinutes > 15) {
      await db.run("DELETE FROM password_resets WHERE id = ?", [resetRecord.id]);
      return res.status(400).json({ message: "Reset link has expired. Please request a new one." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const table = type === "blood_bank" ? "blood_banks" : "users";

    await db.run(`UPDATE ${table} SET password = ? WHERE email = ?`, [hashedPassword, email]);

    // Delete used token
    await db.run("DELETE FROM password_resets WHERE email = ?", [email]);

    res.status(200).json({ message: "Password reset successfully! You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
