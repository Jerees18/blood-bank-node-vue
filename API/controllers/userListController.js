import { db } from "../database/db.js";

/**
 * ✅ Get only donor users
 * (isDonor = 1)
 */
export const donorUsers = async (req, res) => {
  try {
    const donors = await db.all(
      `SELECT id, name, email, phone, city, bloodGroup, age, last_donated
       FROM users
       WHERE isDonor = 1`
    );

    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch donors",
    });
  }
};

/**
 * ✅ Get all users
 */
export const allUsers = async (req, res) => {
  try {
    const users = await db.all(
      `SELECT id, name, email, phone, city, bloodGroup, age, isDonor
       FROM users`
    );

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};
