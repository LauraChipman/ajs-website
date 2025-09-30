// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
});

AdminSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.passwordHash);
};

module.exports = mongoose.model('Admin', AdminSchema);
