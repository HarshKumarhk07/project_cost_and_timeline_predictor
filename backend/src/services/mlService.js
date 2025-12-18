/**
 * Mock ML Service
 * This service acts as a placeholder for the actual Machine Learning model.
 * It returns realistic mock data for development and testing purposes.
 */

class MLService {

    // Simulate generic processing delay
    async _simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
    }

    async predictRisk(inputs) {
        await this._simulateDelay();
        // Mock logic: calculates risk based on generic factors if present
        const baseRisk = Math.floor(Math.random() * 40) + 10; // 10-50 base
        const functionalityRisk = (inputs.features?.length || 0) * 2;
        const totalRisk = Math.min(baseRisk + functionalityRisk, 95);

        return {
            riskScore: totalRisk,
            level: totalRisk > 70 ? 'High' : totalRisk > 40 ? 'Medium' : 'Low',
            factors: [
                'Resource availability volatility',
                'Technical complexity in backend integration',
                'Tight timeline constraints'
            ]
        };
    }

    async predictCost(inputs) {
        await this._simulateDelay();
        // Mock logic: $1000 base + random factor
        const baseCost = 5000;
        const variableCost = Math.floor(Math.random() * 10000);
        const total = baseCost + variableCost;

        return {
            estimatedCost: total,
            currency: 'USD',
            confidence: 85,
            breakdown: {
                development: total * 0.5,
                infrastructure: total * 0.2,
                design: total * 0.15,
                marketing: total * 0.15
            }
        };
    }

    async predictTimeline(inputs) {
        await this._simulateDelay();
        // Mock logic: weeks
        const weeks = Math.floor(Math.random() * 12) + 4; // 4-16 weeks

        return {
            estimatedDurationDays: weeks * 7,
            phases: [
                { name: 'Planning', duration: Math.ceil(weeks * 0.2) + ' weeks' },
                { name: 'Development', duration: Math.ceil(weeks * 0.5) + ' weeks' },
                { name: 'Testing', duration: Math.ceil(weeks * 0.2) + ' weeks' },
                { name: 'Deployment', duration: Math.ceil(weeks * 0.1) + ' weeks' }
            ]
        };
    }

    async generateRecommendations(inputs) {
        await this._simulateDelay();
        return [
            'Consider using a microservices architecture for better scalability.',
            'Allocate 20% buffer time for unexpected integration issues.',
            'Conduct early user testing to validate core features.'
        ];
    }
}

module.exports = new MLService();
