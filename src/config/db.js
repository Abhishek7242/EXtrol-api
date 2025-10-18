// src/config/db.js
const mongoose = require('mongoose');

async function connectDB(uri) {
    if (!uri) throw new Error('MONGODB_URI not provided');

   
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 10000 });

    console.log('✅ Connected to MongoDB successfully');
}

module.exports = connectDB;
