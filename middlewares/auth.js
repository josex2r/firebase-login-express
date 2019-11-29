const admin = require('../lib/firebase-admin');

module.exports = async (req, res, next) => {
  try {
    const cookie = req.cookies.__session || '';

    req.decodedClaims = await admin.auth().verifySessionCookie(cookie, true);

    next();
  } catch(e) {
    res.redirect('/');
  }
};
