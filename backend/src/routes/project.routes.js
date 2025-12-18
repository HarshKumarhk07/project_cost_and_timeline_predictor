const predictionController = require('../controllers/predict.controller');
const { protect } = require('../middleware/auth');
const router = require('express').Router();

router.post('/risk-analysis', protect, predictionController.analyzeRisk);
router.post('/cost-breakdown', protect, predictionController.costBreakdown);
router.post('/timeline-breakdown', protect, predictionController.timelineBreakdown);
router.post('/recommendations', protect, predictionController.recommendations);
router.post('/full-analysis', protect, predictionController.fullAnalysis); // New Endpoint

module.exports = router;
