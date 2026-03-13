import { db } from "../database/db.js";

export const logDonation = async (req, res) => {
  const { donor_id, blood_bank_id, blood_group, quantity_ml } = req.body;
  if (!donor_id || !blood_bank_id || !blood_group || !quantity_ml) {
    return res.status(400).json({ message: "Missing fields required for donation history" });
  }

  try {
    await db.run(
      `INSERT INTO donation_history (donor_id, blood_bank_id, blood_group, quantity_ml) VALUES (?, ?, ?, ?)`,
      [donor_id, blood_bank_id, blood_group, quantity_ml]
    );

    await db.run(
      `UPDATE users SET last_donated = CURRENT_TIMESTAMP WHERE id = ?`,
      [donor_id]
    );

    const existing = await db.get(
      "SELECT quantity_ml FROM blood_stocks WHERE blood_bank_id = ? AND blood_group = ?",
      [blood_bank_id, blood_group]
    );
    if (existing) {
      await db.run(
        "UPDATE blood_stocks SET quantity_ml = quantity_ml + ?, last_updated = CURRENT_TIMESTAMP WHERE blood_bank_id = ? AND blood_group = ?",
        [quantity_ml, blood_bank_id, blood_group]
      );
    } else {
      await db.run(
        "INSERT INTO blood_stocks (blood_bank_id, blood_group, quantity_ml) VALUES (?, ?, ?)",
        [blood_bank_id, blood_group, quantity_ml]
      );
    }

    res.status(201).json({ message: "Donation logged and stock updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getHistory = async (req, res) => {
  const { blood_bank_id, donor_id } = req.query;
  try {
    let query = `
      SELECT h.id, h.blood_group, h.quantity_ml, h.donation_date, u.name as donor_name, b.name as bank_name 
      FROM donation_history h
      JOIN users u ON h.donor_id = u.id
      LEFT JOIN blood_banks b ON h.blood_bank_id = b.id
    `;
    let params = [];
    let conditions = [];

    if (blood_bank_id) {
      conditions.push(`h.blood_bank_id = ?`);
      params.push(blood_bank_id);
    }
    if (donor_id) {
      conditions.push(`h.donor_id = ?`);
      params.push(donor_id);
    }
    
    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(` AND `);
    }
    query += ` ORDER BY h.donation_date DESC`;

    const history = await db.all(query, params);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const logSelfDonation = async (req, res) => {
  const { donor_id, blood_group } = req.body;
  if (!donor_id || !blood_group) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Log a donation with a null blood bank ID, leaving quantity at 0 or a nominal amount
    await db.run(
      `INSERT INTO donation_history (donor_id, blood_bank_id, blood_group, quantity_ml) VALUES (?, NULL, ?, 0)`,
      [donor_id, blood_group]
    );

    await db.run(
      `UPDATE users SET last_donated = CURRENT_TIMESTAMP WHERE id = ?`,
      [donor_id]
    );

    const updatedUser = await db.get("SELECT last_donated FROM users WHERE id = ?", [donor_id]);

    res.status(201).json({ 
      message: "Donation synced successfully", 
      last_donated: updatedUser.last_donated 
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
