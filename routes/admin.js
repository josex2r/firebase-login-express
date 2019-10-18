const express = require('express');
const router = express.Router();

// GET: List films
router.get('/', (req, res, next) => {
    res.render('admin', {
        title: 'Admin',
        files: [],
        filmAdded: !!req.query.filmAdded
    });
});

module.exports = router;
