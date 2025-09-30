const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { ObjectId } = mongoose.Types;
const router = express.Router();

// ✅ Drink Mongoose Schema
const drinkSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imageId: ObjectId,
    alcoholic: Boolean,
    date: { type: Date, default: Date.now }
});

const Drink = mongoose.model('Drink', drinkSchema);

// ✅ Multer in-memory storage for direct streaming
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * ✅ GET all drinks
 * Public + Admin listing
 */
router.get('/', async (req, res) => {
    try {
        const drinks = await Drink.find();
        res.status(200).json(drinks);
    } catch (error) {
        console.error("❌ Error fetching drinks:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * ✅ POST (Admin Upload Route)
 * Accepts name, description, price, alcoholic, image file
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', async (file) => {
            const newDrink = new Drink({
                name: req.body.name,
                description: req.body.description,
                price: parseFloat(req.body.price),
                alcoholic: req.body.alcoholic === 'true',
                imageId: file._id
            });

            await newDrink.save();
            res.status(201).json(newDrink);
        });

        uploadStream.on('error', (err) => {
            console.error("❌ Upload stream error:", err.message);
            res.status(500).json({ message: 'Image upload failed' });
        });

    } catch (error) {
        console.error("❌ Error saving drink:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * ✅ PUT update drink
 */
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price, alcoholic } = req.body;
        const updatedDrink = await Drink.findByIdAndUpdate(
            req.params.id,
            { name, description, price, alcoholic },
            { new: true }
        );

        if (!updatedDrink) {
            return res.status(404).json({ message: 'Drink not found' });
        }

        res.json(updatedDrink);
    } catch (error) {
        console.error("❌ Error updating drink:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * ✅ DELETE drink
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedDrink = await Drink.findByIdAndDelete(req.params.id);
        if (!deletedDrink) {
            return res.status(404).json({ message: 'Drink not found' });
        }
        res.json({ message: '✅ Drink deleted' });
    } catch (error) {
        console.error("❌ Error deleting drink:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
