const express = require('express');
const router = express.Router();
const database = require('../lib/db');

// GET: List films
router.get('/', (req, res, next) => {
    res.render('films', {
        title: 'Films',
        films: database.get('films'),
        filmAdded: !!req.query.filmAdded
    });
});

module.exports = router;
