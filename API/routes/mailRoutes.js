import express from "express";
import { sendEmail } from "../controllers/mailController.js";

const router = express.Router();

// POST - register user
router.post("/send", sendEmail);

export default router;
