const express = require('express');
const router = express.Router();
const { getHistory, getUserHistory, deletePrediction } = require('../controllers/predictHistoryController');
const auth = require('../middleware/auth');

// All routes here should be protected
router.use(auth);

router.get('/history', getHistory);
router.get('/history/:user_id', getUserHistory);
router.delete('/history/:prediction_id', deletePrediction);

module.exports = router;
