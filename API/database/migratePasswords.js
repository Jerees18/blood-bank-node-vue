import { db } from "./db.js";
import bcrypt from "bcryptjs";

async function migratePasswords() {
  console.log("Starting password migration...");
  
  try {
    // Migrate user passwords
    const users = await db.all("SELECT id, password FROM users");
    for (const user of users) {
      // Skip if already hashed (bcrypt hashes start with $2)
      if (user.password.startsWith("$2")) {
        console.log(`User ${user.id}: already hashed, skipping.`);
        continue;
      }
      const hashed = await bcrypt.hash(user.password, 10);
      await db.run("UPDATE users SET password = ? WHERE id = ?", [hashed, user.id]);
      console.log(`User ${user.id}: password hashed successfully.`);
    }

    // Migrate blood bank passwords
    const banks = await db.all("SELECT id, password FROM blood_banks");
    for (const bank of banks) {
      if (bank.password.startsWith("$2")) {
        console.log(`Blood Bank ${bank.id}: already hashed, skipping.`);
        continue;
      }
      const hashed = await bcrypt.hash(bank.password, 10);
      await db.run("UPDATE blood_banks SET password = ? WHERE id = ?", [hashed, bank.id]);
      console.log(`Blood Bank ${bank.id}: password hashed successfully.`);
    }

    console.log("Password migration complete!");
  } catch (err) {
    console.error("Migration failed:", err.message);
  }
}

migratePasswords();
