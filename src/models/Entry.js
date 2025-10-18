// src/models/Entry.js
const mongoose = require('mongoose');

const EntrySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner
    date: { type: String, required: true }, // YYYY-MM-DD
    price: { type: Number, required: true },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Entry', EntrySchema);
