import express from "express";
import { registerBloodBank, loginBloodBank, getBloodBanks } from "../controllers/bloodBankController.js";

const router = express.Router();

router.post("/register", registerBloodBank);
router.post("/login", loginBloodBank);
router.get("/", getBloodBanks);

export default router;
