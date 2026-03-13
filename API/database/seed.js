import { db } from "./db.js";
import { BLOOD_DONORS } from "../MOCKDATA/mock.data.js";

for (const user of BLOOD_DONORS) {
  const result = await db.run(
    `INSERT OR IGNORE INTO users
     (name, email, password, phone, city, bloodGroup, age, isDonor, last_donated)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      user.name,
      user.email,
      user.password,
      user.phone,
      user.city,
      user.bloodGroup,
      user.age,
      1, // isDonor
      user.lastDonated || null
    ]
  );
  
  if (user.lastDonated && result.lastID) {
    await db.run(
      `INSERT INTO donation_history (donor_id, blood_bank_id, blood_group, quantity_ml, donation_date)
       VALUES (?, NULL, ?, 0, ?)`,
      [result.lastID, user.bloodGroup, user.lastDonated]
    );
  }
}

// Insert mock blood banks
const bloodBanks = [
  { name: 'City Central Blood Bank', email: 'admin@citycentralbb.com', password: 'password123', phone: '9876543210', location: 'Downtown Medical Dist.', city: 'Mumbai' },
  { name: 'Hope Blood Centre', email: 'contact@hopebb.com', password: 'password123', phone: '8765432109', location: 'West End', city: 'Delhi' }
];

for (const bank of bloodBanks) {
    await db.run(
        `INSERT OR IGNORE INTO blood_banks (name, email, password, phone, location, city) VALUES (?, ?, ?, ?, ?, ?)`,
        [bank.name, bank.email, bank.password, bank.phone, bank.location, bank.city]
    );
}

const banks = await db.all(`SELECT id FROM blood_banks`);
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

for (const bank of banks) {
    for (const bg of bloodGroups) {
        // Random stock between 500ml and 3000ml
        const randomStock = Math.floor(Math.random() * 2500) + 500;
        await db.run(
            `INSERT OR IGNORE INTO blood_stocks (blood_bank_id, blood_group, quantity_ml) VALUES (?, ?, ?)`,
            [bank.id, bg, randomStock]
        );
    }
}

console.log("✅ Data seeded");
process.exit();
