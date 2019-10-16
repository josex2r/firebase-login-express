const express = require('express');
const router = express.Router();
const admin = require('../lib/firebase-admin');

// Add auth middleware
router.post('/login', (req, res) => {
  const { idToken } = req.body;
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  console.log(idToken, req.body)

  admin.auth().createSessionCookie(idToken, { expiresIn }).then((sessionCookie) => {
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      // secure: true
    };

    res.cookie('__session', sessionCookie, options);

    return admin.auth().verifyIdToken(idToken);
  }).then(() => {
      res.sendStatus(204);
  }).catch((error) => {
    console.log(error)
    res.status(401).send('UNAUTHORIZED REQUEST!');
  });
});

// Logout endpoint
router.get('/logout', (req, res) => {
    res.clearCookie('__session');
    res.redirect('/?logout=true');
});

module.exports = router;
