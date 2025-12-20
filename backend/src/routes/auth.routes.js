const express = require('express');
const router = express.Router();
const { signup, login, me } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// Validation Middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
};

router.post('/signup', [
    check('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    check('email', 'Validation failed: Email must be a @gmail.com address').matches(/^[a-zA-Z0-9._-]+@gmail\.com$/),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], validate, signup);

router.post('/login', [
    check('email', 'Validation failed: Email must be a @gmail.com address').matches(/^[a-zA-Z0-9._-]+@gmail\.com$/),
    check('password', 'Password is required').exists()
], validate, login);

router.get('/me', auth, me);

module.exports = router;
