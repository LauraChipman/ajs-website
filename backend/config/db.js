const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
require('dotenv').config();

let bucket;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = mongoose.connection.db;
        bucket = new GridFSBucket(db, { bucketName: 'uploads' }); // ✅ matches test.uploads.files
        console.log('✅ MongoDB connected and GridFS initialized');

    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        process.exit(1);
    }
};

const getBucket = () => bucket;

module.exports = { connectDB, getBucket };
