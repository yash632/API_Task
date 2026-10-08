require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const usersData = require("./data/users");

const app = express();
app.use(express.json());

// Enable CORS for frontend requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "user_database" })
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("DB Connection error:", err.message));

app.get("/", (req, res) => {
  res.send("running");
});

app.post("/api/users/bulk", async (req, res) => {
  try {
    const data = req.body.users || usersData;

    const insertedUsers = await User.insertMany(data);
    res.status(201).json({
      message: `${insertedUsers.length} users inserted successfully`,
      total: insertedUsers.length
    }
  );
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users", async(req, res) => {
  try {
    const { name, email, age, city, role, salary } = req.body;

    if (!name || !email || !age || !city || !role || !salary) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newUser = await User.create({ name, email, age, city, role, salary });
    res.status(201).json({
      message: "User created successfully",
      user: newUser
    });
  } 
  
  catch (err) {
    res.status(500).json({ error: err.message });
  }
}
);

app.get("/api/users/all", async(req, res) => {
  try {
    const users = await User.find();
    res.json({
      total: users.length,
      users
    });
  } 
  catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const users = await User.find()
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      page,
      limit,
      totalUsers,
      totalPages,
      users
    }
  );} 
  catch (err) {
    res.status(500).json({
      error: err.message
    
}
  );
  }
});

app.listen(5000, () => {
  console.log(`Server running on http://localhost:5000`);
});
