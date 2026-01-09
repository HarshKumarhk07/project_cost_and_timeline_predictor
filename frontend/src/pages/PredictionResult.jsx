import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { FaDownload, FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaClock, FaDollarSign, FaShieldAlt } from 'react-icons/fa';
import predictionApi from '../services/predictionApi';

const PredictionResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { data, predictionId, inputs } = location.state || {};

    // If no data in location state, redirect back
    useEffect(() => {
        if (!data || !predictionId) {
            navigate('/predict/new');
        }
    }, [data, predictionId, navigate]);

    if (!data || !predictionId) {
        console.warn('PredictionResult: Missing data or predictionId', { data, predictionId });
        return (
            <div className="flex items-center justify-center h-64 flex-col gap-4">
                <Loader />
                <p className="text-gray-500">Loading prediction details...</p>
                {/* Debug helper: if it hangs here, user sees this */}
                <Button variant="ghost" onClick={() => navigate('/predict/new')}>
                    Return to Form
                </Button>
            </div>
        );
    }

    console.log('PredictionResult rendering with:', { data, predictionId });


    const handleDownloadPDF = async () => {
        setLoading(true);
        try {
            const res = await predictionApi.getReportPDF(predictionId);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prediction-${predictionId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('PDF download failed:', error);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCSV = async () => {
        setLoading(true);
        try {
            const res = await predictionApi.getReportCSV(predictionId);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prediction-${predictionId}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('CSV download failed:', error);
            alert('Failed to download CSV. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const cost = data.cost || {};
    const timeline = data.timeline || {};
    const recommendations = data.recommendations || [];

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        {inputs?.title || 'Prediction Results'}
                    </h1>
                    <p className="text-gray-600">Your AI-powered project analysis is ready</p>
                </div>
                <Button
                    variant="secondary"
                    onClick={() => navigate('/predict/history')}
                    className="flex items-center gap-2"
                >
                    <FaArrowLeft />
                    Back to History
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cost Card */}
                <Card className="border-l-4 border-emerald-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                            <FaDollarSign className="text-2xl text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 bg-emerald-50 px-3 py-1 rounded-full">
                            {cost.confidence || 85}% confidence
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Estimated Cost</h3>
                    <p className="text-4xl font-bold text-gray-900 mb-4">
                        {(cost.estimatedCost === null || cost.estimatedCost === undefined)
                            ? 'Processing...'
                            : `$${cost.estimatedCost.toLocaleString()}`}
                    </p>
                    {cost.breakdown && (
                        <div className="pt-4 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Development</span>
                                <span className="font-medium">${Math.round(cost.breakdown.development || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Infrastructure</span>
                                <span className="font-medium">${Math.round(cost.breakdown.infrastructure || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Design</span>
                                <span className="font-medium">${Math.round(cost.breakdown.design || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </Card>

                {/* Timeline Card */}
                <Card className="border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <FaClock className="text-2xl text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 bg-indigo-50 px-3 py-1 rounded-full">
                            Estimated
                        </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Timeline</h3>
                    <p className="text-4xl font-bold text-gray-900 mb-1">
                        {(timeline.estimatedDurationDays === null || timeline.estimatedDurationDays === undefined)
                            ? 'Processing...'
                            : `${Math.ceil(timeline.estimatedDurationDays / 7)} Weeks`}
                    </p>
                    <p className="text-gray-600 mb-4">
                        {(timeline.estimatedDurationDays === null || timeline.estimatedDurationDays === undefined)
                            ? 'Analysis in progress'
                            : `${timeline.estimatedDurationDays} days total`}
                    </p>
                    {timeline.phases && timeline.phases.length > 0 && (
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-xs font-medium text-gray-600 mb-2">Key Phases:</p>
                            <ul className="space-y-1">
                                {timeline.phases.slice(0, 3).map((phase, i) => (
                                    <li key={i} className="text-sm text-gray-600">
                                        • {typeof phase === 'object' ? `${phase.name}: ${phase.duration}` : phase}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </Card>
            </div>

            {/* Recommendations */}
            {
                recommendations.length > 0 && (
                    <Card>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FaCheckCircle className="text-emerald-600" />
                            Recommendations
                        </h2>
                        <ul className="space-y-3">
                            {recommendations.map((rec, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="text-emerald-600 mt-1">•</span>
                                    <span className="text-gray-700">{rec}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )
            }

            {/* Actions */}
            <Card className="bg-gray-50">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Export Results</h3>
                        <p className="text-sm text-gray-600">Download your prediction as PDF or CSV</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="secondary"
                            onClick={handleDownloadPDF}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <FaDownload />
                            PDF
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleDownloadCSV}
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            <FaDownload />
                            CSV
                        </Button>
                    </div>
                </div>
            </Card>
        </div >
    );
};

export default PredictionResult;

