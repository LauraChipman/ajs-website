const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const router = express.Router();

// ✅ Middleware to verify token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// ✅ GET /api/admin – dashboard verification route
router.get('/', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the admin dashboard!' });
});

// ✅ PUT /api/admin/update-credentials – change password
router.put('/update-credentials', authenticateToken, async (req, res) => {
    const { currentPassword, newUsername, newPassword } = req.body;

    try {
        const admin = await Admin.findOne(); // Assuming only one admin account

        const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        if (newUsername) admin.username = newUsername; // optional
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            admin.passwordHash = await bcrypt.hash(newPassword, salt);
        }

        await admin.save();
        res.json({ message: 'Credentials updated successfully' });
    } catch (error) {
        console.error("❌ Error updating admin credentials:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
