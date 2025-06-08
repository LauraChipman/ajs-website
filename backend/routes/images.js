const express = require('express');
const { ObjectId } = require('mongoose').Types;
const { getBucket } = require('../config/db');

const router = express.Router();

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const { collection } = req.query;
    const bucket = getBucket();

    if (!bucket) {
        console.error("❌ GridFSBucket not initialized.");
        return res.status(503).json({ error: 'GridFS not initialized. Try again later.' });
    }

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid image ID' });
    }

    try {
        // Set the bucket name (uploads, events, etc.)
        const stream = bucket.openDownloadStream(new ObjectId(id), {
            // Custom bucket name? Set `bucketName` if needed:
            // bucketName: collection || 'uploads'
        });

        stream.on('error', (err) => {
            console.error(`❌ Stream error: ${err.message}`);
            return res.status(404).json({ error: 'Image not found' });
        });

        res.setHeader('Content-Type', 'image/jpeg');
        stream.pipe(res);
    } catch (error) {
        console.error(`❌ Error streaming image: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
