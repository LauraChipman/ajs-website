require('dotenv').config({ path: '../.env' });  // ✅ Load environment variables
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

mongoose.set('strictQuery', false);  // ✅ Suppress the Mongoose warning

const uri = process.env.MONGO_URI;
const collections = ["events", "drinks", "gallery"];

const updateImageIds = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("✅ Connected to MongoDB!");

        for (const collection of collections) {
            const dbCollection = mongoose.connection.db.collection(collection);

            const documents = await dbCollection.find({}).toArray();

            for (const doc of documents) {
                if (typeof doc.imageId === 'string') {
                    // Generate a new ObjectId
                    const newImageId = new ObjectId();

                    // Update the document
                    await dbCollection.updateOne(
                        { _id: doc._id },
                        { $set: { imageId: newImageId } }
                    );

                    console.log(`✅ Updated document in ${collection}: ${doc._id} → New imageId: ${newImageId}`);
                }
            }
        }

        console.log("🎉 All documents have been updated!");
        mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error updating image IDs:", error.message);
        mongoose.connection.close();
    }
};

updateImageIds();
