const express = require('express');
const router = express.Router();
const admin = require('../lib/firebase-admin');

// Add auth middleware
router.post('/login', (req, res) => {
  const { idToken } = req.body;

  // @TODO
});

// Logout endpoint
router.get('/logout', (req, res) => {
  // @TODO
  res.redirect('/?logout=true');
});

module.exports = router;
