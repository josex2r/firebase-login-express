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

router.post('/upload', (req, res) => {
    req.busboy.on('file', (attrName, file, filename, encoding, mimetype) => {
        uploadToFirebase(file, filename, mimetype).then(() => {
            res.redirect('/admin');
        }).catch(() => {
            res.sendStatus(500);
        });
    });
});

module.exports = router;
