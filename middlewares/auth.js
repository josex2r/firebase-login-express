const admin = require('../lib/firebase-admin');

module.exports = (req, res, next) => {
  const sessionCookie = req.cookies.__session || '';

  admin.auth().verifySessionCookie(sessionCookie, true).then((decodedClaims) => {
    req.decodedClaims = decodedClaims;
    next();
  }).catch((error) => {
    res.redirect('/');
  });
};
