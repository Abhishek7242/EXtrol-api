// src/server.js
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const entriesRoutes = require('./routes/entries');
const authRoutes = require('./routes/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan('dev'));
app.use(cors()); // set origin in production
app.use(express.json());

// Public auth routes
app.use('/api/auth', authRoutes);

// Protected entries routes
app.use('/api/entries', entriesRoutes);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

// start, require MONGODB_URI (unless dev-mode override)
(async function start() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not set in env');
        await connectDB(uri);
        app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    } catch (err) {
        console.error('Failed to start', err);
        process.exit(1);
    }
})();
