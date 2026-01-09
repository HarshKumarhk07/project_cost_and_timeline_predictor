import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';
import predictionApi from '../services/predictionApi';
import { FaArrowLeft } from 'react-icons/fa';

const Compare = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [predictions, setPredictions] = useState([]);
    const [selectedIds, setSelectedIds] = useState(location.state?.ids || []);
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comparing, setComparing] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await predictionApi.getHistory();
                setPredictions(res.data.data || []);
            } catch (err) {
                console.error('Failed to load predictions:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const toggleSelection = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(x => x !== id);
            } else {
                if (prev.length >= 3) {
                    alert('Maximum 3 items can be compared at once');
                    return prev;
                }
                return [...prev, id];
            }
        });
    };

    const handleCompare = async () => {
        if (selectedIds.length < 2) {
            alert('Please select at least 2 items to compare');
            return;
        }
        setComparing(true);
        try {
            const res = await predictionApi.comparePredictions(selectedIds);
            setComparisonData(res.data.data || []);
        } catch (error) {
            console.error('Compare failed:', error);
            alert('Failed to compare predictions. Please try again.');
        } finally {
            setComparing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Compare Predictions</h1>
                    <p className="text-gray-600">Select up to 3 predictions to compare side by side</p>
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

            {!comparisonData && (
                <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Projects to Compare</h2>
                    {predictions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No predictions available. Create some predictions first!</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {predictions.map(p => {
                                    const cost = p.outputs?.cost?.estimatedCost || p.outputs?.estimatedCost || 0;
                                    const isSelected = selectedIds.includes(p._id);
                                    return (
                                        <div
                                            key={p._id}
                                            onClick={() => toggleSelection(p._id)}
                                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-indigo-300 bg-white'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-semibold text-gray-900">{p.title}</h4>
                                                {isSelected && (
                                                    <span className="text-indigo-600 font-bold">✓</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-1">{p.projectType}</p>
                                            <p className="text-sm font-medium text-gray-900 mb-2">
                                                {(cost === null || cost === undefined || cost === 0) ? 'Processing...' : `$${cost.toLocaleString()}`}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleCompare}
                                    disabled={selectedIds.length < 2 || comparing}
                                >
                                    {comparing ? 'Comparing...' : `Compare Selected (${selectedIds.length})`}
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            )}

            {comparisonData && comparisonData.length > 0 && (
                <div>
                    <Button
                        onClick={() => setComparisonData(null)}
                        variant="secondary"
                        className="mb-4"
                    >
                        Back to Selection
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {comparisonData.map(item => {
                            const cost = item.outputs?.cost?.estimatedCost || item.outputs?.estimatedCost || 0;
                            const timeline = item.outputs?.timeline?.estimatedDurationDays || item.outputs?.estimatedDuration || 0;
                            return (
                                <Card key={item._id} className="border-l-4 border-indigo-500">
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Estimated Cost</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {(cost === null || cost === undefined || cost === 0) ? 'Processing...' : `$${cost.toLocaleString()}`}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Timeline</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {(timeline === null || timeline === undefined || timeline === 0) ? 'Processing...' : `${Math.ceil(timeline / 7)} weeks`}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {(timeline === null || timeline === undefined || timeline === 0) ? 'Analysis in progress' : `${timeline} days`}
                                            </p>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200">
                                            <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Project Type</p>
                                            <p className="text-sm font-medium text-gray-900">{item.projectType}</p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;

