const express = require('express');
const router = express.Router();

// Add auth middleware
router.post('/login', (req, res) => {
  // @TODO
});

// Logout endpoint
router.get('/logout', (req, res) => {
  // @TODO
  res.redirect('/?logout=true');
});

module.exports = router;
