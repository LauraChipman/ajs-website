const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log("📥 Login request received:", { username, password });

    try {
        const admin = await Admin.findOne({ username: 'admin' });
        console.log("🔎 Admin found:", !!admin);

        if (!admin) {
            console.log("❌ Admin not found");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, admin.passwordHash);
        console.log("🔐 Password match result:", isMatch);

        if (!isMatch) {
            console.log("❌ Password does not match");
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
        console.log("✅ JWT token generated");

        res.json({ token });
    } catch (error) {
        console.error("❌ Login error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
