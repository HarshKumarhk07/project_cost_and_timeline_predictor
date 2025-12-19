const express = require('express');
const router = express.Router();
const Test = require('../models/Test');

// @route   POST /test-mongo/add
// @desc    Add a test document
// @access  Public
router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const newTest = await Test.create({ name });
        res.status(201).json({ message: 'Test document created', data: newTest });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route   GET /test-mongo
// @desc    Get all test documents
// @access  Public
router.get('/', async (req, res) => {
    try {
        const tests = await Test.find().sort({ createdAt: -1 });
        res.json(tests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
