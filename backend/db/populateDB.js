require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ Connected to MongoDB Atlas");
}).catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
});

const eventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    time: String,
    description: String,
    price: Number,
    imageId: mongoose.Types.ObjectId,
    ticketsAvailable: Number,
});

const drinkSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    imageId: mongoose.Types.ObjectId,
    alcoholic: Boolean,
});

const gallerySchema = new mongoose.Schema({
    title: String,
    description: String,
    imageId: mongoose.Types.ObjectId,
    date: Date,
});

const Event = mongoose.model('Event', eventSchema);
const Drink = mongoose.model('Drink', drinkSchema);
const Gallery = mongoose.model('Gallery', gallerySchema);

const seedDatabase = async () => {
    await Event.create({
        title: "Live Music Night",
        date: new Date("2025-06-01T20:00:00Z"),
        time: "8:00 PM",
        description: "An amazing night of live music and entertainment.",
        price: 20,
        ticketsAvailable: 150
    });

    await Drink.create({
        name: "Whiskey Sour",
        description: "Classic whiskey cocktail with a citrus twist.",
        price: 12,
        alcoholic: true
    });

    await Gallery.create({
        title: "Grand Opening",
        description: "Photos from the grand opening night.",
        date: new Date("2025-05-01T00:00:00Z")
    });

    console.log("🎉 Database populated successfully!");
    mongoose.connection.close();
};

seedDatabase();
