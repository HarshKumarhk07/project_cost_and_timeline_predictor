const Prediction = require('../models/Prediction');
const MLService = require('../services/mlService');
const PDFDocument = require('pdfkit');


// Helper to save prediction
const savePrediction = async (user, type, inputs, outputs, title) => {
    const prediction = await Prediction.create({
        user: user.id,
        title: title || `${type} Analysis - ${new Date().toISOString()}`,
        projectType: inputs.projectType || 'Software',
        inputs,
        outputs,
        status: 'completed'
    });
    return prediction;
};

// POST /predict/risk-analysis
exports.analyzeRisk = async (req, res) => {
    try {
        const result = await MLService.predictRisk(req.body);

        // Save to history
        const saved = await savePrediction(req.user, 'Risk', req.body, result, req.body.title);

        res.status(200).json({
            success: true,
            data: result,
            predictionId: saved._id
        });
    } catch (error) {
        console.error('Risk Analysis Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST /predict/cost-breakdown
exports.costBreakdown = async (req, res) => {
    try {
        const result = await MLService.predictCost(req.body);

        const saved = await savePrediction(req.user, 'Cost', req.body, result, req.body.title);

        res.status(200).json({
            success: true,
            data: result,
            predictionId: saved._id
        });
    } catch (error) {
        console.error('Cost Breakdown Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST /predict/full-analysis
exports.fullAnalysis = async (req, res) => {
    try {
        // Run all analyses in parallel
        const [risk, cost, timeline, recommendations] = await Promise.all([
            MLService.predictRisk(req.body),
            MLService.predictCost(req.body),
            MLService.predictTimeline(req.body),
            MLService.generateRecommendations(req.body)
        ]);

        const combinedResult = {
            risk,
            cost,
            timeline,
            recommendations
        };

        // Save ONCE
        const saved = await savePrediction(req.user, 'Full Analysis', req.body, combinedResult, req.body.title);

        res.status(200).json({
            success: true,
            data: combinedResult,
            predictionId: saved._id
        });
    } catch (error) {
        console.error('Full Analysis Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST /predict/timeline-breakdown
exports.timelineBreakdown = async (req, res) => {
    try {
        const result = await MLService.predictTimeline(req.body);

        const saved = await savePrediction(req.user, 'Timeline', req.body, result, req.body.title);

        res.status(200).json({
            success: true,
            data: result,
            predictionId: saved._id
        });
    } catch (error) {
        console.error('Timeline Breakdown Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// POST /predict/recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const result = await MLService.generateRecommendations(req.body);

        // We might not always want to save just recommendation requests, but let's save for consistency if needed, 
        // or we can treat it as part of a larger prediction. For now, I'll return it directly.
        // If the user wants it saved, we can wrap it. Let's assume we return it directly for now as it's often auxiliary.
        // Or we can save specific "Consultation" records. Let's just return it.

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Recommendations Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// GET /predict/compare?ids=id1,id2
exports.comparePredictions = async (req, res) => {
    try {
        const { ids } = req.query;
        if (!ids) {
            return res.status(400).json({ success: false, message: 'Please provide prediction IDs to compare' });
        }

        const idArray = ids.split(',');
        const predictions = await Prediction.find({
            _id: { $in: idArray },
            user: req.user.id // Security: ensure user owns them
        });

        res.status(200).json({
            success: true,
            count: predictions.length,
            data: predictions
        });
    } catch (error) {
        console.error('Compare Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// GET /predict/report/pdf/:id
exports.getReportPDF = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id || req.params.prediction_id);
        if (!prediction) {
            return res.status(404).json({ success: false, message: 'Prediction not found' });
        }

        // Verify ownership (or admin)
        if (prediction.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const doc = new PDFDocument();
        const filename = `prediction-${prediction._id}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // --- PDF CONTENT ---
        // Header
        doc.fontSize(25).text('PredictHub Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Project: ${prediction.title}`);
        doc.text(`Type: ${prediction.projectType}`);
        doc.text(`Date: ${new Date(prediction.createdAt).toLocaleDateString()}`);
        doc.moveDown();
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown();

        // Data Breakdown
        if (prediction.outputs) {
            if (prediction.outputs.risk) {
                doc.fontSize(16).text('Risk Analysis', { underline: true });
                doc.fontSize(12).text(`Risk Level: ${prediction.outputs.risk.level}`);
                doc.text(`Risk Score: ${prediction.outputs.risk.riskScore}`);
                doc.moveDown();
            }

            if (prediction.outputs.cost) {
                doc.fontSize(16).text('Cost Breakdown', { underline: true });
                doc.fontSize(12).text(`Estimated Cost: $${prediction.outputs.cost.estimatedCost?.toLocaleString()}`);
                doc.text(`Confidence: ${prediction.outputs.cost.confidence}%`);
                doc.moveDown();
            }

            if (prediction.outputs.timeline) {
                doc.fontSize(16).text('Timeline', { underline: true });
                doc.fontSize(12).text(`Duration: ${prediction.outputs.timeline.estimatedDurationDays} Days`);
                doc.moveDown();
            }

            if (prediction.outputs.recommendations && prediction.outputs.recommendations.length > 0) {
                doc.fontSize(16).text('Recommendations', { underline: true });
                doc.moveDown(0.5);
                prediction.outputs.recommendations.forEach(rec => {
                    doc.fontSize(12).text(`• ${rec}`);
                });
                doc.moveDown();
            }
        }

        doc.fontSize(10).text('Generated by PredictHub AI', { align: 'center', valign: 'bottom' });

        doc.end();

    } catch (error) {
        console.error('PDF Report Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// GET /predict/report/csv/:id
exports.getReportCSV = async (req, res) => {
    try {
        const prediction = await Prediction.findById(req.params.id || req.params.prediction_id);
        if (!prediction) return res.status(404).json({ message: 'Not found' });

        // CSV HEADER
        let csvContent = "Category,Metric,Value\n";

        // Basic Info
        csvContent += `Info,Project Title,"${prediction.title}"\n`;
        csvContent += `Info,Project Type,${prediction.projectType}\n`;
        csvContent += `Info,Date,${new Date(prediction.createdAt).toISOString()}\n`;

        // Risk
        if (prediction.outputs?.risk) {
            csvContent += `Risk,Level,${prediction.outputs.risk.level}\n`;
            csvContent += `Risk,Score,${prediction.outputs.risk.riskScore}\n`;
        }

        // Cost
        if (prediction.outputs?.cost) {
            csvContent += `Cost,Estimated Cost,${prediction.outputs.cost.estimatedCost}\n`;
            csvContent += `Cost,Confidence,${prediction.outputs.cost.confidence}%\n`;
        }

        // Timeline
        if (prediction.outputs?.timeline) {
            csvContent += `Timeline,Duration (Days),${prediction.outputs.timeline.estimatedDurationDays}\n`;
        }

        res.header('Content-Type', 'text/csv');
        res.attachment(`prediction-${prediction._id}.csv`);
        return res.send(csvContent);

    } catch (error) {
        console.error('CSV Report Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
