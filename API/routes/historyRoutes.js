import express from "express";
import { logDonation, getHistory, logSelfDonation } from "../controllers/historyController.js";

const router = express.Router();

router.post("/log", logDonation);
router.post("/self-log", logSelfDonation);
router.get("/", getHistory);

export default router;
