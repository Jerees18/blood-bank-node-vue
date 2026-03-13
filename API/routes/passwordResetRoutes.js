import express from "express";
import { requestReset, resetPassword } from "../controllers/passwordResetController.js";

const router = express.Router();

router.post("/request", requestReset);
router.post("/reset", resetPassword);

export default router;
