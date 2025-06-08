const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { ObjectId } = mongoose.Types;
const router = express.Router();

// ✅ Mongoose Schema
const GallerySchema = new mongoose.Schema({
    title: String,
    description: String,
    imageId: ObjectId,
    date: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', GallerySchema);

// ✅ Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * ✅ GET all gallery images
 */
router.get('/', async (req, res) => {
    try {
        const images = await Gallery.find();
        res.json(images);
    } catch (error) {
        console.error('Error fetching gallery images:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * ✅ POST (create new gallery item)
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            contentType: req.file.mimetype
        });

        uploadStream.end(req.file.buffer);

        uploadStream.on('finish', async (file) => {
            const newGalleryItem = new Gallery({
                title: req.body.title,
                description: req.body.description,
                imageId: file._id
            });

            await newGalleryItem.save();
            res.status(201).json(newGalleryItem);
        });

        uploadStream.on('error', (err) => {
            console.error("❌ Upload stream error:", err.message);
            res.status(500).json({ message: 'Image upload failed' });
        });

    } catch (error) {
        console.error("❌ Gallery upload error:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * ✅ PUT (update gallery item by ID)
 */
router.put('/:id', upload.single('file'), async (req, res) => {
    try {
        const update = {
            title: req.body.title,
            description: req.body.description
        };

        if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
            const uploadStream = bucket.openUploadStream(req.file.originalname);
            uploadStream.end(req.file.buffer);

            uploadStream.on('finish', async (file) => {
                update.imageId = file._id;
                await Gallery.findByIdAndUpdate(req.params.id, update);
                res.json({ message: 'Gallery item updated with new image.' });
            });

            uploadStream.on('error', (err) => {
                console.error("❌ Image update stream error:", err.message);
                res.status(500).json({ message: 'Image upload failed.' });
            });
        } else {
            await Gallery.findByIdAndUpdate(req.params.id, update);
            res.json({ message: 'Gallery item updated.' });
        }
    } catch (error) {
        console.error("❌ Error updating gallery item:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * ✅ DELETE (remove gallery item by ID)
 */
router.delete('/:id', async (req, res) => {
    try {
        await Gallery.findByIdAndDelete(req.params.id);
        res.json({ message: 'Gallery item deleted.' });
    } catch (error) {
        console.error("❌ Error deleting gallery item:", error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
