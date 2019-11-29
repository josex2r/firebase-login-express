const path = require('path');
const fs = require('fs');
const express = require('express');
const admin = require('firebase-admin');
const uniqArray = require('../lib/uniq-array');

const router = express.Router();

const getBucketFilename = (email, filename) => `${email}/${filename}`;

function uploadFile(file, ref, mimetype) {
    return new Promise((resolve, reject) => {
        file
            .pipe(ref.createWriteStream({
                metadata: {
                    contentType: mimetype
                }
            }))
            .on('finish', resolve)
            .on('error', reject);
    });
}

async function getFiles(email) {
    const snapshot = await admin.firestore()
        .collection('uploads')
        .doc(email)
        .get();

    return snapshot.data().files || [];
}

async function uploadToFirebase(email, filename, file, mimetype) {
    const storage = admin.storage();
    const bucket = storage.bucket('gs://curso-nodejs-kairos.appspot.com');
    const bucketFilename = getBucketFilename(email, filename);
    const ref = bucket.file(bucketFilename);

    await uploadFile(file, ref, mimetype);

    const currentFiles = await getFiles(email);

    return admin.firestore().collection('uploads').doc(email).set({
        files: uniqArray([...currentFiles, filename])
    }, {
        merge: true
    });
}

async function downloadFromFirebase(email, filename) {
    const storage = admin.storage();
    const bucket = storage.bucket('gs://curso-nodejs-kairos.appspot.com');
    const bucketFilename = getBucketFilename(email, filename);
    const fileRef = bucket.file(bucketFilename);
    const [fileExists] = await fileRef.exists();

    if (fileExists) {
        return fileRef.createReadStream();
    }

    const placeholderPath = path.join(__dirname, '../public/img/placeholder.png');

    return fs.createReadStream(placeholderPath);
}

/* GET home page. */
router.get('/', async(req, res) => {
    const { email } = req.decodedClaims;
    const files = await getFiles(email);

    res.render('files', {
        fileAdded: !!req.query.fileAdded,
        title: 'Files',
        files
    });
});

router.post('/upload', (req, res) => {
    const { email } = req.decodedClaims;

    req.busboy.on('file', async (attrName, file, filename, encoding, mimetype) => {
        if (attrName !== 'fileInput') {
            res.redirect('/files');
            return;
        }

        await uploadToFirebase(email, filename, file, mimetype);
        res.redirect('/files?fileAdded=true');
    });

    req.pipe(req.busboy);
});

router.get('/:filename', async (req, res) => {
    const { filename } = req.params;
    const { email } = req.decodedClaims;
    const fileStream = await downloadFromFirebase(email, filename);

    fileStream.pipe(res);
});

module.exports = router;
