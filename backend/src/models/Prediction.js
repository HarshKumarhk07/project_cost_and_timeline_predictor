const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    projectType: {
        type: String,
        required: true,
        enum: ['Software', 'Construction', 'Marketing', 'Other'],
        default: 'Software'
    },
    inputs: {
        type: Object, // Flexible to store different inputs for cost, timeline, risk
        required: true
    },
    outputs: {
        riskScore: Number,
        estimatedCost: Number,
        estimatedDuration: Number, // in days
        confidenceLevel: Number, // 0-100
        breakdown: Object, // detailed breakdown
        recommendations: [String]
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
