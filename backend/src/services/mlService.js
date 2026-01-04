const axios = require('axios');

/**
 * Real ML Service Integration
 * Connects to the deployed Python/Flask ML Service to get predictions.
 */
class MLService {
    constructor() {
        this.mlServiceUrl = process.env.ML_SERVICE_URL;
    }

    /**
     * Call the external ML service to predict cost and timeline.
     * @param {Object} inputs - { priority, budget, hours_spent, task_count }
     */
    async predictProjectStats(inputs) {
        if (!this.mlServiceUrl) {
            console.error('ML_SERVICE_URL is not defined in environment variables.');
            throw new Error('ML Service Configuration Error');
        }

        try {
            // Map inputs to the exact payload expected by ML service
            // User requested: { priority, budget, hours_spent, task_count }
            const payload = {
                priority: inputs.priority || 'Medium',
                budget: inputs.budget || 0,
                hours_spent: inputs.hours_spent || 0,
                task_count: inputs.task_count || 0
            };

            const response = await axios.post(`${this.mlServiceUrl}/predict`, payload);

            // Expecting response: { predicted_cost, estimated_timeline_days }
            const { predicted_cost, estimated_timeline_days } = response.data;

            return {
                predicted_cost,
                estimated_timeline_days
            };
        } catch (error) {
            console.error('ML Service Prediction Error:', error.message);
            if (error.response) {
                console.error('ML Service Response:', error.response.data);
            }
            throw new Error('Failed to get prediction from ML service');
        }
    }

    // --- Adapters for Legacy Methods (keeping response format) ---

    async predictCost(inputs) {
        const stats = await this.predictProjectStats(inputs);
        const totalCost = stats.predicted_cost;

        return {
            estimatedCost: totalCost,
            currency: 'USD',
            confidence: 85, // Placeholder
            breakdown: {
                development: Math.round(totalCost * 0.6),
                infrastructure: Math.round(totalCost * 0.15),
                design: Math.round(totalCost * 0.15),
                marketing: Math.round(totalCost * 0.1)
            }
        };
    }

    async predictTimeline(inputs) {
        const stats = await this.predictProjectStats(inputs);
        const totalDays = stats.estimated_timeline_days;
        const totalWeeks = Math.ceil(totalDays / 7);

        const planningWeeks = Math.max(1, Math.ceil(totalWeeks * 0.15));
        const devWeeks = Math.max(1, Math.ceil(totalWeeks * 0.6));
        const testingWeeks = Math.max(1, Math.ceil(totalWeeks * 0.2));
        const deployWeeks = Math.max(1, Math.ceil(totalWeeks * 0.05));

        return {
            estimatedDurationDays: totalDays,
            phases: [
                { name: 'Planning & Design', duration: `${planningWeeks} weeks` },
                { name: 'Development', duration: `${devWeeks} weeks` },
                { name: 'Testing & QA', duration: `${testingWeeks} weeks` },
                { name: 'Deployment', duration: `${deployWeeks} weeks` }
            ]
        };
    }

    async predictRisk(inputs) {
        // ML Service doesn't provide risk, using simplified heuristic or default
        // as we removed the old hardcoded logic.
        return {
            riskScore: 25,
            level: 'Low',
            factors: ['Risk analysis pending deeper ML integration']
        };
    }

    async generateRecommendations(inputs) {
        return [
            'Ensure continuous monitoring of project metrics.',
            'Update ML model with real project data periodically.'
        ];
    }
}

module.exports = new MLService();
