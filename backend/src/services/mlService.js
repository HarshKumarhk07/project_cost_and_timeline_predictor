/**
 * Mock ML Service
 * This service acts as a placeholder for the actual Machine Learning model.
 * It returns realistic mock data for development and testing purposes.
 * UPDATED: Now uses simple heuristics based on inputs to provide consistent results.
 */

class MLService {

    // Simulate generic processing delay
    async _simulateDelay() {
        return new Promise(resolve => setTimeout(resolve, 800)); // slightly longer delay for "thinking" feel
    }

    async predictRisk(inputs) {
        await this._simulateDelay();

        let riskScore = 20; // Base risk
        const factors = [];

        // heuristic: high complexity increases risk
        if (inputs.complexityLevel === 'High' || inputs.complexityLevel === 'Very High') {
            riskScore += 25;
            factors.push('High project complexity increases delivery risk');
        }

        // heuristic: large team or very small team
        if (inputs.teamSize > 10) {
            riskScore += 10;
            factors.push('Large team size may increase communication overhead');
        } else if (inputs.teamSize < 2) {
            riskScore += 15;
            factors.push('Small team size creates localized dependency risks');
        }

        // heuristic: tight timeline (hours vs features)
        // Assume roughly 50 hours per feature is "safe" ?? 
        // Let's just say if features > 20 and hours < 500
        if (inputs.numberOfFeatures > 20) {
            riskScore += 10;
            factors.push('High feature count increases scope creep risk');
        }

        // tech stack risk
        if (inputs.techStack && inputs.techStack.length > 5) {
            riskScore += 10;
            factors.push('Complex technology stack increases integration risk');
        }

        // Cap risk
        riskScore = Math.min(Math.max(riskScore, 5), 98);

        let level = 'Low';
        if (riskScore > 75) level = 'High';
        else if (riskScore > 40) level = 'Medium';

        return {
            riskScore,
            level,
            factors
        };
    }

    async predictCost(inputs) {
        await this._simulateDelay();

        // Simple heuristic: Hours * Rate * TeamSize? 
        // Usually estimatedHours is total effort. 
        // Let's assume average hourly rate of $50
        const hourlyRate = 60;
        const baseCost = (inputs.estimatedHours || 100) * hourlyRate;

        // Adjust for complexity
        let multiplier = 1.0;
        if (inputs.complexityLevel === 'High') multiplier = 1.3;
        if (inputs.complexityLevel === 'Very High') multiplier = 1.5;
        if (inputs.experienceLevel === 'Expert') multiplier = 1.4; // Higher rates for experts

        const totalCost = Math.round(baseCost * multiplier);

        return {
            estimatedCost: totalCost,
            currency: 'USD',
            confidence: 85, // Mock confidence
            breakdown: {
                development: Math.round(totalCost * 0.6),
                infrastructure: Math.round(totalCost * 0.15),
                design: Math.round(totalCost * 0.15),
                marketing: Math.round(totalCost * 0.1)
            }
        };
    }

    async predictTimeline(inputs) {
        await this._simulateDelay();

        // Heuristic: Estimated Hours / (Team Size * 30 hours/week) -> Weeks
        // 30 effective hours per person per week
        const weeklyCapacity = (inputs.teamSize || 1) * 30;
        const totalWeeks = Math.ceil((inputs.estimatedHours || 100) / weeklyCapacity);
        const totalDays = totalWeeks * 7; // Calendar days

        // Phase duration heuristics
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

    async generateRecommendations(inputs) {
        await this._simulateDelay();
        const recs = [
            'Implement automated CI/CD pipelines early to reduce deployment friction.'
        ];

        if (inputs.projectType === 'Software') {
            recs.push('Adopt an Agile methodology to handle changing requirements effectively.');
        }

        if (inputs.teamSize > 5) {
            recs.push('Structure the team into squads to maintain agility.');
        }

        if (inputs.complexityLevel === 'High' || inputs.complexityLevel === 'Very High') {
            recs.push('Invest heavily in system architecture planning before coding starts.');
            recs.push('Conduct regular code reviews to maintain code quality.');
        }

        if (inputs.techStack && inputs.techStack.length > 0) {
            const stack = inputs.techStack.join(', ');
            recs.push(`Ensure the team has sufficient training on ${stack}.`);
        }

        return recs;
    }
}

module.exports = new MLService();
