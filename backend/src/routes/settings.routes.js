const router = require('express').Router();
const auth = require('../middleware/auth');
const { getSettings, updateSettings } = require('../controllers/settings.controller');

router.get('/', auth, getSettings);
router.put('/', auth, updateSettings);

module.exports = router;
