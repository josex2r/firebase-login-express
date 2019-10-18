const express = require('express');
const router = express.Router();
const admin = require('../lib/firebase-admin');

function uploadToFirebase(file, filename, mimetype) {
    const storage = admin.storage();
    const bucket = storage.bucket('gs://curso-nodejs-kairos.appspot.com');
    const fileReference = bucket.file(filename);

    return new Promise((resolve, reject) => {
        file.pipe(
            fileReference.createWriteStream({
                metadata: {
                    contentType: mimetype
                }
            })
        )
            .on('finish', resolve)
            .on('error', reject);
    });
}

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
