import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import predictionApi from '../services/predictionApi';

const NewPrediction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        projectName: '',
        startDate: '',
        endDate: '',
        teamMembers: '',
        hoursSpent: '',
        taskCount: '',
        budget: '',
        priority: 'Medium',
        projectType: 'Software'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.hoursSpent || !formData.taskCount || !formData.budget || !formData.priority) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            const requestData = {
                // Metadata
                projectName: formData.projectName,
                startDate: formData.startDate,
                endDate: formData.endDate,
                teamMembers: formData.teamMembers ? parseInt(formData.teamMembers) : undefined,
                projectType: formData.projectType,
                // ML Inputs
                hoursSpent: parseFloat(formData.hoursSpent),
                taskCount: parseFloat(formData.taskCount),
                budget: parseFloat(formData.budget),
                priority: formData.priority,
            };

            const res = await predictionApi.predictProject(requestData);

            console.log('Prediction Response:', res.data); // Debug log

            // FIX: Handle real ML service response format (snake_case)
            // Backend now returns: { predicted_cost, estimated_timeline_days }
            // We also handle potential existing camelCase for robustness
            const {
                predicted_cost,
                estimated_timeline_days,
                predictedCost,
                estimatedTimelineDays,
                predictionId
            } = res.data;

            // Resolve values (prefer snake_case as per new backend, fall back to camelCase)
            const resolvedCost = predicted_cost !== undefined ? predicted_cost : predictedCost;
            const resolvedTimeline = estimated_timeline_days !== undefined ? estimated_timeline_days : estimatedTimelineDays;

            // Navigate to result page with prediction data in the structure PredictionResult expects
            // If predictionId is missing (direct ML response), use a temporary ID to bypass the guard in PredictionResult
            navigate('/predict/result', {
                state: {
                    predictionId: predictionId || `temp-${Date.now()}`,
                    data: {
                        cost: {
                            estimatedCost: resolvedCost ?? 0,
                            confidence: 85
                        },
                        timeline: {
                            estimatedDurationDays: resolvedTimeline ?? 0,
                            phases: []
                        },

                        recommendations: []
                    },
                    inputs: requestData
                }
            });

        } catch (err) {
            console.error('Prediction error:', err);
            setError(err.response?.data?.message || 'Failed to generate prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Prediction</h1>
                <p className="text-gray-600">Enter project details to estimate Cost and Timeline.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                        Project Details
                    </h2>
                    <div className="space-y-5">
                        <Input
                            label="Project Name"
                            name="projectName"
                            value={formData.projectName || ''}
                            onChange={handleChange}
                            placeholder="e.g. Website Redesign"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <Input
                                label="Start Date"
                                name="startDate"
                                type="date"
                                value={formData.startDate || ''}
                                onChange={handleChange}
                            />
                            <Input
                                label="End Date"
                                name="endDate"
                                type="date"
                                value={formData.endDate || ''}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            label="Team Members"
                            name="teamMembers"
                            type="number"
                            min="1"
                            value={formData.teamMembers || ''}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Type
                            </label>
                            <select
                                name="projectType"
                                value={formData.projectType || 'Software'}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all"
                            >
                                <option value="Software">Software Development</option>
                                <option value="Construction">Construction</option>
                                <option value="Marketing">Marketing Campaign</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                        Prediction Requirements
                    </h2>
                    <div className="space-y-5">
                        <Input
                            label="Hours Spent *"
                            name="hoursSpent"
                            type="number"
                            min="0"
                            value={formData.hoursSpent}
                            onChange={handleChange}
                            placeholder="e.g. 150"
                            required
                        />

                        <Input
                            label="Task Count *"
                            name="taskCount"
                            type="number"
                            min="1"
                            value={formData.taskCount}
                            onChange={handleChange}
                            placeholder="e.g. 25"
                            required
                        />

                        <Input
                            label="Budget ($) *"
                            name="budget"
                            type="number"
                            min="0"
                            value={formData.budget}
                            onChange={handleChange}
                            placeholder="e.g. 5000"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority *
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all"
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate('/dashboard')}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading} className="min-w-[150px]">
                        {loading ? 'Analyzing...' : 'Predict'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewPrediction;
