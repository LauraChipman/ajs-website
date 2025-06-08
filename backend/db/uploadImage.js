require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const { GridFSBucket } = require('mongodb');
const path = require('path');

const uri = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ MongoDB Connected");

    const db = mongoose.connection.db;
    const bucket = new GridFSBucket(db, {
        bucketName: 'uploads'  // Change this if you want a different collection name
    });

    const filePath = path.join(__dirname, '../example-image.jpg');  // ✅ Adjust the path if necessary
    console.log(`🚀 Uploading image from: ${filePath}`);

    const uploadStream = bucket.openUploadStream('example-image.jpg', {
        metadata: {
            description: "This is a sample image"
        },
        contentType: 'image/jpeg',
    });

    fs.createReadStream(filePath)
        .pipe(uploadStream)
        .on('error', (err) => {
            console.error("❌ Error uploading image:", err.message);
        })
        .on('finish', () => {
            console.log(`✅ Image successfully uploaded to GridFS with ID: ${uploadStream.id}`);
            mongoose.connection.close();
        });

}).catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
});
