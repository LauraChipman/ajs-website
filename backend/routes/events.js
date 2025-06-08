const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { ObjectId } = mongoose.Types;
const Event = require('../models/Event');

const router = express.Router();

// ✅ Multer in-memory for GridFS
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * ✅ GET all events
 */
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        console.error("Error fetching events:", err.message);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ✅ POST new event with image
 */
router.post('/', upload.single('file'), async (req, res) => {
    try {
        let imageId = null;

        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

            const uploadStream = bucket.openUploadStream(req.file.originalname, {
                contentType: req.file.mimetype
            });

            uploadStream.end(req.file.buffer);

            uploadStream.on('finish', async (file) => {
                imageId = file._id;

                const newEvent = new Event({
                    title: req.body.title,
                    description: req.body.description,
                    date: req.body.date,
                    time: req.body.time,
                    price: req.body.price,
                    ticketsAvailable: req.body.ticketsAvailable,
                    imageId
                });

                await newEvent.save();
                res.status(201).json(newEvent);
            });

            uploadStream.on('error', (err) => {
                console.error("GridFS upload error:", err.message);
                res.status(500).json({ message: 'Image upload failed' });
            });
        } else {
            const newEvent = new Event(req.body);
            await newEvent.save();
            res.status(201).json(newEvent);
        }
    } catch (err) {
        console.error("Error creating event:", err.message);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ✅ PUT (update) event
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedEvent);
    } catch (err) {
        console.error("Error updating event:", err.message);
        res.status(500).json({ message: err.message });
    }
});

/**
 * ✅ DELETE event
 */
router.delete('/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error("Error deleting event:", err.message);
        res.status(500).json({ message: err.message });
    }
});
/**
 * ✅ GET single event by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        console.error("Error fetching event by ID:", err.message);
        res.status(500).json({ message: err.message });
    }
});
module.exports = router;
