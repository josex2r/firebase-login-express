const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('files', {
        title: 'Files',
        files: []
    });
});

module.exports = router;
