const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// ✅ About Schema
const AboutSchema = new mongoose.Schema({
    content: String,
    lastUpdated: { type: Date, default: Date.now }
});
const About = mongoose.model('About', AboutSchema);

// ✅ GET - Return latest About content
router.get('/', async (req, res) => {
    try {
        const latest = await About.findOne().sort({ lastUpdated: -1 });
        if (!latest) {
            return res.status(404).json({ message: 'No About entry found' });
        }
        res.json(latest);
    } catch (error) {
        console.error('❌ Error fetching about:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});


// ✅ POST - Create new entry
router.post('/', async (req, res) => {
    try {
        const entry = new About({ content: req.body.content });
        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        console.error('❌ Error saving about:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ PUT - Update latest entry
router.put('/:id', async (req, res) => {
    try {
        const updated = await About.findByIdAndUpdate(
            req.params.id,
            { content: req.body.content, lastUpdated: new Date() },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: 'About entry not found' });
        }

        res.json(updated);
    } catch (error) {
        console.error('❌ Error updating about:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ✅ DELETE
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await About.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'About entry not found' });
        }
        res.json({ message: '✅ About entry deleted' });
    } catch (error) {
        console.error('❌ Error deleting about:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
