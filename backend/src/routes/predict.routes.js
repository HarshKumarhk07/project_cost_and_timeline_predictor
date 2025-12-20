const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    analyzeRisk,
    costBreakdown,
    timelineBreakdown,
    getRecommendations,
    fullAnalysis,
    comparePredictions,
    getReportPDF,
    getReportCSV,
    predictProject
} = require('../controllers/predict.controller');

router.use(auth);

router.post('/risk-analysis', analyzeRisk);
router.post('/cost-breakdown', costBreakdown);
router.post('/timeline-breakdown', timelineBreakdown);
router.post('/recommendations', getRecommendations);
router.post('/full-analysis', fullAnalysis);
router.post('/', predictProject); // Main prediction endpoint

router.get('/compare', comparePredictions);

router.get('/report/pdf/:prediction_id', getReportPDF);
router.get('/report/csv/:prediction_id', getReportCSV);

module.exports = router;
