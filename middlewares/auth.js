const admin = require('../lib/firebase-admin');

module.exports = (req, res, next) => {
  const sessionCookie = req.cookies.__session || '';

  console.log('sessionCookie', sessionCookie)

  admin.auth().verifySessionCookie(sessionCookie, true).then((decodedClaims) => {
    next();
  }).catch((error) => {
    res.redirect('/');
  });
};
