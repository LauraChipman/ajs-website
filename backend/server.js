const express = require('express');
const { connectDB } = require('./config/db');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const eventsRoute = require('./routes/events');
const drinksRoutes = require('./routes/drinks');
const imageRoutes = require('./routes/images');
const galleryRoutes = require('./routes/gallery');
const aboutRoutes = require('./routes/about');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const loginRoutes = require('./routes/login');
const socialRoutes = require('./routes/social');

const app = express();
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ajs-website-8d33.vercel.app'
];
// ✅ Added Vercel URL to CORS whitelist

// ✅ Async IIFE to connect DB before server starts
(async () => {
    try {
        await connectDB(); // MongoDB + GridFS initialized
        console.log("✅ Successfully connected to MongoDB Atlas");
        startServer();     // Now safe to start Express
    } catch (err) {
        console.error("❌ Failed to initialize MongoDB:", err.message);
    }
})();

function startServer() {
    mongoose.set('strictQuery', false);

    // ✅ Middleware
    app.use(cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                console.error(`❌ Blocked by CORS: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ✅ API Routes
    app.use('/api/events', eventsRoute);
    app.use('/api/drinks', drinksRoutes);
    app.use('/api/image', imageRoutes);
    app.use('/api/gallery', galleryRoutes);
    app.use('/api/about', aboutRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/admin', adminRoutes);    // Admin routes (update password, etc.)
    app.use('/api/login', loginRoutes);    // Login route (auth with DB)
    app.use('/api/social', socialRoutes);

    // ✅ Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🌐 Server running on http://localhost:${PORT}`));
}
