const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

module.exports = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://curso-nodejs-kairos.firebaseio.com'
});
