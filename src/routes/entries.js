// src/routes/entries.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/entriesController');
const auth = require('../middleware/auth');

router.use(auth); // protect all routes below

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
