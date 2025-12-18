const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateUser, getUser } = require('../controllers/user.controller');

router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);

module.exports = router;
