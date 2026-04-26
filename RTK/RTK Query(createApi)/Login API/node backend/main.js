const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const Oauth = require('Oauth');

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY = "your_secret_key_here";
const usersFilePath = path.join(__dirname, 'DB', 'users.json');

// --- DATA PERSISTENCE HELPERS ---

// Load users from JSON file on startup
let users = [];
try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    users = JSON.parse(data);
} catch (err) {
    console.error("Could not read users file. Ensure DB/users.json exists.");
}

// Helper function to save state
const saveUsersToFile = (usersData) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), 'utf-8');
    } catch (err) {
        console.error("Error saving data:", err);
    }
};

// --- AUTH MIDDLEWARE ---
function authenticateJWT(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token missing" });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        // Find the user in the current in-memory array
        const user = users.find(u => u.id === decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        req.user = user; 
        next();
    });
}

// --- BANKING ROUTES ---

app.get("/account/balance", authenticateJWT, (req, res) => {
    res.json({
        username: req.user.username,
        balance: req.user.balance
    });
});

app.post("/account/deposit", authenticateJWT, (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid amount" });

    // Update in-memory
    req.user.balance += Number(amount);
    req.user.transactions.unshift({
        type: "DEPOSIT",
        amount: Number(amount),
        date: new Date().toISOString()
    });

    // Save to file
    saveUsersToFile(users);

    res.json({ message: "Deposit successful", newBalance: req.user.balance });
});

app.post("/account/transfer", authenticateJWT, (req, res) => {
    const { toUsername, amount } = req.body;
    const recipient = users.find(u => u.username === toUsername);

    if (!recipient) return res.status(404).json({ message: "Recipient not found" });
    if (amount <= 0 || req.user.balance < amount) {
        return res.status(400).json({ message: "Insufficient funds or invalid amount" });
    }

    // Deduct from sender
    req.user.balance -= Number(amount);
    req.user.transactions.unshift({
        type: "TRANSFER_OUT",
        to: toUsername,
        amount: Number(amount),
        date: new Date().toISOString()
    });

    // Add to recipient
    recipient.balance += Number(amount);
    recipient.transactions.unshift({
        type: "TRANSFER_IN",
        from: req.user.username,
        amount: Number(amount),
        date: new Date().toISOString()
    });

    // Save to file
    saveUsersToFile(users);

    res.json({ message: "Transfer successful", currentBalance: req.user.balance });
});

app.get("/account/transactions", authenticateJWT, (req, res) => {
    res.json(req.user.transactions);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
        return res.json({ token });
    }
    res.status(401).json({ message: "Invalid credentials" });
});

app.listen(5000, () => console.log("Bank Server running on http://localhost:5000"));
