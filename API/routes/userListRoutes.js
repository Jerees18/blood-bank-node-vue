import express from "express";
import { donorUsers, allUsers } from "../controllers/userListController.js";

const router = express.Router();

router.get("/donors", donorUsers);
router.get("/all-users", allUsers);

export default router;

