import { db } from "./db.js";
import fs from "fs";

const sql = fs.readFileSync("./database/init.sql", "utf8");

await db.exec(sql);

console.log("✅ Database initialized");
process.exit();
