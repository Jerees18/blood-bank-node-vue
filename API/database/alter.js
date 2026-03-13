import { db } from "./db.js";

async function runMigration() {
  const migrations = [
    { sql: "ALTER TABLE users ADD COLUMN last_donated DATETIME;", name: "last_donated" },
    { sql: "ALTER TABLE users ADD COLUMN weight INTEGER;", name: "weight" },
    { sql: "ALTER TABLE users ADD COLUMN hasDisease INTEGER DEFAULT 0;", name: "hasDisease" },
    { sql: "CREATE TABLE IF NOT EXISTS password_resets (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, token TEXT NOT NULL, user_type TEXT DEFAULT 'user', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);", name: "password_resets_table" },
  ];

  for (const migration of migrations) {
    try {
      await db.run(migration.sql);
      console.log(`Migration successful: added ${migration.name} column to users.`);
    } catch(e) {
      if (e.message.includes("duplicate column name")) {
        console.log(`Migration already applied: ${migration.name}`);
      } else {
        console.error(`Migration failed for ${migration.name}:`, e.message);
      }
    }
  }
}

runMigration();
