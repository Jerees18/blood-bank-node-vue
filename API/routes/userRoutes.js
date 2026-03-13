import express from "express";
import { registerUser, loginUser, becomeDonor } from "../controllers/userController.js";

const router = express.Router();

// POST - register user
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/become-donor", becomeDonor);

export default router;
