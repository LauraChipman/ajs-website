
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// MongoDB Schema
const DrinkSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    date: { type: Date, default: Date.now }
});

const Drink = mongoose.model('Drink', DrinkSchema);

// Get all drinks
router.get('/', async (req, res) => {
    try {
        const drinks = await Drink.find();
        res.json(drinks);
    } catch (error) {
        console.error('Error fetching drinks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Add a new drink
router.post('/', async (req, res) => {
    const { title, description, price, imageUrl } = req.body;
    try {
        const newDrink = new Drink({
            title,
            description,
            price,
            imageUrl
        });
        await newDrink.save();
        res.status(201).json(newDrink);
    } catch (error) {
        console.error('Error adding drink:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
