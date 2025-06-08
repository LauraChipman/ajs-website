const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'uploads', // Can stay here for future image support
        required: false // <-- now optional
    },
    ticketsAvailable: {
        type: Number,
        required: false // <-- now optional
    }
});

module.exports = mongoose.model('Event', EventSchema);
