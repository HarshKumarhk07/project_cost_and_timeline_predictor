const express = require('express');
const router = express.Router();
const { getAllPredictions, getAllUsers } = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const role = require('../middleware/role'); // Assuming role middleware check exists or I'll implement inline check if not

// Middleware to check if user is admin
// Since I don't see 'role.js' content in detail, I'll inline a simple admin check or use if available.
// I saw 'role.js' in middleware folder list. Let's assume it exports a function or I'll define one.
// To be safe and clean, I will define a local middleware here or use the one if I knew it.
// Given strict instructions not to break, I'll rely on a manual check inside the route or a simple middleware here.
// I'll stick to a simple inline check to ensure it works without guessing 'role.js' export.

const adminCheck = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied: Admin only' });
    }
};

router.use(auth);
router.use(adminCheck);

router.get('/predictions', getAllPredictions);
router.get('/users', getAllUsers);

module.exports = router;
