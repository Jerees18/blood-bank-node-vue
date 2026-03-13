import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import mailRoutes from "./routes/mailRoutes.js";
import userListRoutes from "./routes/userListRoutes.js";
import bloodBankRoutes from "./routes/bloodBankRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import passwordResetRoutes from "./routes/passwordResetRoutes.js";

const app = express();
 
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/mail", mailRoutes);
app.use("/api/listuser", userListRoutes);
app.use("/api/blood-banks", bloodBankRoutes);
app.use("/api/blood-stocks", stockRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/password-reset", passwordResetRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
