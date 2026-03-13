import { db } from "../database/db.js";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const user = await db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email]
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Login success
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      bloodGroup: user.bloodGroup,
      age: user.age,
      weight: user.weight,
      isDonor: user.isDonor === 1 ? true : false,
      last_donated: user.last_donated
    },
  });
};


export const registerUser = async (req, res) => {
  const { username, email, password, phone, city } = req.body;

  // Validation
  if (!username || !email || !password || !phone || !city) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    // Check existing user
    const existingUser = await db.get(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUser) {
      return res.status(409).json({
        message: "User already registered",
      });
    }

    // Insert user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      `INSERT INTO users (name, email, password, phone, city, isDonor)
       VALUES (?, ?, ?, ?, ?, 0)`,
      [username, email, hashedPassword, phone, city]
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.lastID,
        username,
        email,
        phone,
        city,
        last_donated: null
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const becomeDonor = async (req, res) => {
  const { email, bloodGroup, age, city, weight, hasDisease } = req.body;

  // Validation
  if (!email || !bloodGroup || !age || !city || !weight) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (weight < 45) {
    return res.status(400).json({
      message: "Minimum weight to become a donor is 45 kg",
    });
  }

  if (hasDisease) {
    return res.status(400).json({
      message: "You cannot become a donor if you have a disease",
    });
  }

  try {
    // Check user exists
    const user = await db.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update user as donor
    await db.run(
      `UPDATE users
       SET isDonor = 1,
           bloodGroup = ?,
           age = ?,
           city = ?,
           weight = ?,
           hasDisease = ?
       WHERE email = ?`,
      [bloodGroup, age, city, weight, hasDisease ? 1 : 0, email]
    );

    // Fetch updated user
    const updatedUser = await db.get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    res.status(200).json({
      message: "User updated as donor successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        bloodGroup: updatedUser.bloodGroup,
        age: updatedUser.age,
        city: updatedUser.city,
        weight: updatedUser.weight,
        hasDisease: updatedUser.hasDisease === 1,
        isDonor: true,
        last_donated: updatedUser.last_donated,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
