import { ObjectId } from 'mongodb';
import Grid from 'gridfs-stream';
import mongoose from 'mongoose';

const uri = process.env.MONGO_URI;
let gfs;

const connect = async () => {
    if (mongoose.connection.readyState !== 1) {
        console.log("🚀 Connecting to MongoDB...");
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ MongoDB Connected!");

        // 🟢 Listen for connection and only initialize GridFS when it's ready
        mongoose.connection.once('open', () => {
            console.log("🚀 Setting up GridFS...");
            const db = mongoose.connection.db;
            gfs = Grid(db, mongoose.mongo);
            console.log("✅ GridFS Ready!");
        });
    }
};

export default async function handler(req, res) {
    await connect();

    const { image_id, collection } = req.query;

    if (!image_id || !ObjectId.isValid(image_id)) {
        return res.status(400).json({ error: 'Invalid Image ID' });
    }

    if (!gfs) {
        console.log("❌ GridFS not initialized yet. Please try again.");
        return res.status(503).json({ error: 'GridFS not initialized. Try again.' });
    }

    try {
        console.log(`🚀 Fetching image ${image_id} from ${collection}...`);
        gfs.collection(collection);

        const readStream = gfs.createReadStream({
            _id: new ObjectId(image_id),
        });

        res.setHeader('Content-Type', 'image/jpeg');
        readStream.pipe(res);

        readStream.on('error', (err) => {
            console.error('Stream error:', err.message);
            res.status(404).send('Image not found');
        });

    } catch (err) {
        console.error('Error streaming image:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
