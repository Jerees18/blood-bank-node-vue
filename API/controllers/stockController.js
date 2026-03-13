import { db } from "../database/db.js";

export const getStock = async (req, res) => {
  try {
    const { blood_bank_id } = req.query;
    let query = `
      SELECT s.id, s.blood_bank_id, s.blood_group, s.quantity_ml, s.last_updated, b.name as bank_name, b.city, b.location, b.phone
      FROM blood_stocks s
      JOIN blood_banks b ON s.blood_bank_id = b.id
    `;
    let params = [];
    if (blood_bank_id) {
      query += ` WHERE s.blood_bank_id = ?`;
      params.push(blood_bank_id);
    }
    const stocks = await db.all(query, params);
    res.status(200).json(stocks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateStock = async (req, res) => {
  const { blood_bank_id, blood_group, quantity_ml } = req.body; 
  if (!blood_bank_id || !blood_group || quantity_ml === undefined) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const existing = await db.get(
      "SELECT quantity_ml FROM blood_stocks WHERE blood_bank_id = ? AND blood_group = ?",
      [blood_bank_id, blood_group]
    );

    if (existing) {
      const newQuantity = existing.quantity_ml + Number(quantity_ml);
      await db.run(
        "UPDATE blood_stocks SET quantity_ml = ?, last_updated = CURRENT_TIMESTAMP WHERE blood_bank_id = ? AND blood_group = ?",
        [Math.max(0, newQuantity), blood_bank_id, blood_group]
      );
    } else {
      await db.run(
        "INSERT INTO blood_stocks (blood_bank_id, blood_group, quantity_ml) VALUES (?, ?, ?)",
        [blood_bank_id, blood_group, Math.max(0, Number(quantity_ml))]
      );
    }
    res.status(200).json({ message: "Stock updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
