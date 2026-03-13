import express from "express";
import { getStock, updateStock } from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getStock);
router.post("/update", updateStock);

export default router;
