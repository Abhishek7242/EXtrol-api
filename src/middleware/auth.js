// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

module.exports = async function authMiddleware(req, res, next) {
    try {
        const auth = req.headers.authorization || '';
        if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing or invalid Authorization header' });

        const token = auth.slice(7);
        const payload = jwt.verify(token, JWT_SECRET);

        // attach user info to request
        const user = await User.findById(payload.sub).select('-passwordHash').lean();
        if (!user) return res.status(401).json({ error: 'User not found' });

        req.user = user;
        next();
    } catch (err) {
        // token errors return 401
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
