CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  city TEXT,
  bloodGroup TEXT,
  age INTEGER,
  isDonor INTEGER DEFAULT 0,
  last_donated DATETIME,
  weight INTEGER,
  hasDisease INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS blood_banks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  city TEXT
);

CREATE TABLE IF NOT EXISTS blood_stocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  blood_bank_id INTEGER,
  blood_group TEXT,
  quantity_ml INTEGER,
  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (blood_bank_id) REFERENCES blood_banks(id),
  UNIQUE (blood_bank_id, blood_group)
);

CREATE TABLE IF NOT EXISTS donation_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_id INTEGER,
  blood_bank_id INTEGER,
  blood_group TEXT,
  quantity_ml INTEGER,
  donation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (donor_id) REFERENCES users(id),
  FOREIGN KEY (blood_bank_id) REFERENCES blood_banks(id)
);

CREATE TABLE IF NOT EXISTS password_resets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  token TEXT NOT NULL,
  user_type TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
