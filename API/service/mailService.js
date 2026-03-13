import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendEmailLogic = async ({ to, subject, html, text, replyTo, senderName }) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    const fromName = senderName || "Blood Bank System";
    const info = await transporter.sendMail({
      from: `"${fromName}" <${process.env.EMAIL_USER}>`,
      replyTo: replyTo,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully!", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
