import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import predictionApi from '../services/predictionApi';

const NewPrediction = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        projectType: 'Software',
        teamSize: '',
        experienceLevel: 'Intermediate',
        techStack: '',
        numberOfFeatures: '',
        complexityLevel: 'Medium',
        estimatedHours: '',
        priority: 'Medium',
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
            if (!formData.title || !formData.teamSize || !formData.numberOfFeatures || !formData.estimatedHours) {
                setError('Please fill in all required fields');
                setLoading(false);
                return;
            }

            const payload = {
                title: formData.title,
                projectType: formData.projectType,
                teamSize: parseInt(formData.teamSize),
                experienceLevel: formData.experienceLevel,
                techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
                numberOfFeatures: parseInt(formData.numberOfFeatures),
                complexityLevel: formData.complexityLevel,
                estimatedHours: parseInt(formData.estimatedHours),
                priority: formData.priority,
            };

            const res = await predictionApi.fullAnalysis(payload);
            
            // Navigate to result page with prediction data
            navigate('/predict/result', {
                state: {
                    predictionId: res.data.predictionId,
                    data: res.data.data,
                    inputs: payload
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
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">New Project Prediction</h1>
                <p className="text-gray-600">Fill in the details below to get AI-powered cost and timeline estimates</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Overview Section */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                        Project Overview
                    </h2>
                    <div className="space-y-5">
                        <Input
                            label="Project Title *"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. E-Commerce Platform"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Project Type *
                            </label>
                            <select
                                name="projectType"
                                value={formData.projectType}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all"
                                required
                            >
                                <option value="Software">Software Development</option>
                                <option value="Construction">Construction</option>
                                <option value="Marketing">Marketing Campaign</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Team & Experience Section */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                        Team & Experience
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="Team Size *"
                            name="teamSize"
                            type="number"
                            min="1"
                            value={formData.teamSize}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Experience Level *
                            </label>
                            <select
                                name="experienceLevel"
                                value={formData.experienceLevel}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all"
                                required
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Technical Details Section */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                        Technical Details
                    </h2>
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tech Stack
                            </label>
                            <textarea
                                name="techStack"
                                value={formData.techStack}
                                onChange={handleChange}
                                placeholder="e.g. React, Node.js, MongoDB (comma-separated)"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition-all h-24"
                            />
                            <p className="mt-1.5 text-sm text-gray-500">Enter technologies separated by commas</p>
                        </div>
                    </div>
                </Card>

                {/* Project Scope Section */}
                <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                        Project Scope
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input
                            label="Number of Features *"
                            name="numberOfFeatures"
                            type="number"
                            min="1"
                            value={formData.numberOfFeatures}
                            onChange={handleChange}
                            placeholder="e.g. 10"
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complexity Level *
                            </label>
                            <select
                                name="complexityLevel"
                                value={formData.complexityLevel}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all"
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Very High">Very High</option>
                            </select>
                        </div>

                        <Input
                            label="Estimated Hours *"
                            name="estimatedHours"
                            type="number"
                            min="1"
                            value={formData.estimatedHours}
                            onChange={handleChange}
                            placeholder="e.g. 800"
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
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Submit Button */}
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
                        {loading ? 'Analyzing...' : 'Generate Prediction'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewPrediction;
