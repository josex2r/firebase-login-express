const express = require('express');
const router = express.Router();
const admin = require('../lib/firebase-admin');

// Add auth middleware
router.post('/login', async (req, res) => {
  try {
    const { idToken } = req.body;

    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const auth = admin.auth();
    const cookie = await auth.createSessionCookie(idToken, { expiresIn });
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      // secure: true
    };

    await auth.verifyIdToken(idToken);

    res.cookie('__session', cookie, options);
    res.sendStatus(204);
  } catch(e) {
    res.status(401).send('UNAUTHORIZED REQUEST!');
  }
});

// Logout endpoint
router.get('/logout', (req, res) => {
  res.clearCookie('__session');
  res.redirect('/?logout=true');
});

module.exports = router;
