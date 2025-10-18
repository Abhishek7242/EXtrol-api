// src/controllers/entriesController.js
const Entry = require('../models/Entry');

// List entries for current user
exports.list = async (req, res, next) => {
    try {
        const sortBy = req.query.sort || 'date';
        const sort = sortBy === 'price' ? { price: -1 } : { date: -1 };
        const limit = Math.min(parseInt(req.query.limit || '0', 10) || 0, 1000);

        const docs = await Entry.find({ user: req.user._id }).sort(sort).limit(limit).lean();
        res.json(docs);
    } catch (err) {
        next(err);
    }
};

// Get single entry (ensure owner)
exports.get = async (req, res, next) => {
    try {
        const doc = await Entry.findById(req.params.id).lean();
        if (!doc) return res.status(404).json({ error: 'Not found' });
        if (String(doc.user) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
        res.json(doc);
    } catch (err) {
        next(err);
    }
};

// Create entry (owned by logged-in user)
exports.create = async (req, res, next) => {
    try {
        const { date, price, note } = req.body;
        if (!date || price === undefined) return res.status(400).json({ error: 'date and price required' });

        const entry = new Entry({ user: req.user._id, date, price: Number(price), note: note || '' });
        const saved = await entry.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err);
    }
};

// Update (only owner)
exports.update = async (req, res, next) => {
    try {
        const id = req.params.id;
        const existing = await Entry.findById(id);
        if (!existing) return res.status(404).json({ error: 'Not found' });
        if (String(existing.user) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });

        const payload = {};
        if (req.body.date !== undefined) payload.date = req.body.date;
        if (req.body.price !== undefined) payload.price = Number(req.body.price);
        if (req.body.note !== undefined) payload.note = req.body.note;

        const updated = await Entry.findByIdAndUpdate(id, payload, { new: true }).lean();
        res.json(updated);
    } catch (err) {
        next(err);
    }
};

// Delete (only owner)
exports.remove = async (req, res, next) => {
    try {
        const id = req.params.id;
        const existing = await Entry.findById(id);
        if (!existing) return res.status(404).json({ error: 'Not found' });
        if (String(existing.user) !== String(req.user._id)) return res.status(403).json({ error: 'Forbidden' });

        const r = await Entry.findByIdAndDelete(id);
        res.json({ ok: !!r });
    } catch (err) {
        next(err);
    }
};
