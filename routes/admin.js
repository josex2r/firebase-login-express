const express = require('express');
const router = express.Router();
const admin = require('../lib/firebase-admin');

const getBucketFilename = (email, filename) => `${email}/${filename}`;

async function uploadToFirebase(email, filename, file, mimetype) {
    const storage = admin.storage();
    const bucket = storage.bucket('gs://curso-nodejs-kairos.appspot.com');
    const bucketFilename = getBucketFilename(email, filename);
    const fileReference = bucket.file(bucketFilename);

    await new Promise((resolve, reject) => {
        file
            .pipe(fileReference.createWriteStream({
                metadata:{
                    contentType: mimetype
                }
            }))
            .on('finish', resolve)
            .on('error', reject);
    });

    const currentFiles = await getFiles(email);

    return admin.firestore().collection('uploads').doc(email).set({
        files: Array.from(new Set([...currentFiles, filename]))
    }, { merge: true });
}

async function getFiles(email) {
    const snapshot = await admin.firestore().collection('uploads').doc(email).get();

    return snapshot.data().files || [];
}

router.get('/', async (req, res, next) => {
    const { email } = req.decodedClaims; // middleware "auth.js"
    const files = await getFiles(email);

    res.render('admin', {
        title: 'Admin',
        files,
        filmAdded: !!req.query.fileAdded
    });
});

router.post('/upload', (req, res) => {
    const { email } = req.decodedClaims; // middleware "auth.js"

    req.busboy.on('file', (attrName, file, filename, encoding, mimetype) => {
        if (attrName !== 'fileInput') {
            res.redirect('/admin');
            return;
        }

        uploadToFirebase(email, filename, file, mimetype).then(() => {
            res.redirect('/admin?fileAdded=true');
        });
    });
});

module.exports = router;
