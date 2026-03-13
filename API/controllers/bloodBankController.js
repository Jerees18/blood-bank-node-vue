// bloodBankController.js
import { db } from "../database/db.js";
import bcrypt from "bcryptjs";

export const registerBloodBank = async (req, res) => {
  const { name, email, password, phone, location, city } = req.body;
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const existing = await db.get("SELECT id FROM blood_banks WHERE email = ?", [email]);
    if (existing) return res.status(409).json({ message: "Blood Bank already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      `INSERT INTO blood_banks (name, email, password, phone, location, city) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, phone, location, city]
    );

    res.status(201).json({ message: "Registered successfully", blood_bank_id: result.lastID });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const loginBloodBank = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });

  try {
    const bank = await db.get(`SELECT * FROM blood_banks WHERE email = ?`, [email]);
    if (!bank) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, bank.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Don't send password back to client
    const { password: _, ...bankData } = bank;
    res.status(200).json({ message: "Login successful", bank: bankData });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getBloodBanks = async (req, res) => {
  try {
    const banks = await db.all(`SELECT id, name, email, phone, location, city FROM blood_banks`);
    res.status(200).json(banks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
