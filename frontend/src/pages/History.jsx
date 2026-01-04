import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';
import { FaTrash, FaFilePdf, FaFileCsv, FaEye, FaExchangeAlt } from 'react-icons/fa';
import predictionApi from '../services/predictionApi';

const History = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(new Set());
    const [deleting, setDeleting] = useState(null);

    const fetchHistory = async () => {
        try {
            const res = await predictionApi.getHistory();
            setHistory(res.data.data || []);
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this prediction?')) return;
        setDeleting(id);
        try {
            await predictionApi.deletePrediction(id);
            setHistory(history.filter(h => h._id !== id));
            setSelected(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete prediction. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    const handleDownloadPdf = async (id) => {
        try {
            const response = await predictionApi.getReportPDF(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prediction-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('PDF Download failed', error);
            alert('Failed to download PDF. Please try again.');
        }
    };

    const handleDownloadCsv = async (id) => {
        try {
            const response = await predictionApi.getReportCSV(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prediction-${id}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('CSV Download failed', error);
            alert('Failed to download CSV. Please try again.');
        }
    };

    const toggleSelect = (id) => {
        setSelected(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleCompare = () => {
        if (selected.size < 2) {
            alert('Please select at least 2 predictions to compare');
            return;
        }
        navigate('/predict/compare', { state: { ids: Array.from(selected) } });
    };

    const viewPrediction = (item) => {
        // Navigate to result page with prediction data
        navigate('/predict/result', {
            state: {
                predictionId: item._id,
                data: item.outputs,
                inputs: item.inputs,
                title: item.title
            }
        });
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
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Prediction History</h1>
                    <p className="text-gray-600">View and manage your past predictions</p>
                </div>
                {selected.size >= 2 && (
                    <Button onClick={handleCompare} className="flex items-center gap-2">
                        <FaExchangeAlt />
                        Compare Selected ({selected.size})
                    </Button>
                )}
            </div>

            {history.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-gray-600 mb-4">No predictions found. Create your first one!</p>
                    <Button onClick={() => navigate('/predict/new')}>
                        Create New Prediction
                    </Button>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((item) => {
                        const cost = item.outputs?.cost?.estimatedCost || item.outputs?.estimatedCost || 0;
                        const timeline = item.outputs?.timeline?.estimatedDurationDays || item.outputs?.estimatedDuration || 0;
                        const isSelected = selected.has(item._id);

                        return (
                            <Card
                                key={item._id}
                                className={`border-2 transition-all cursor-pointer hover:shadow-lg ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                                    }`}
                                onClick={() => toggleSelect(item._id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                {item.projectType}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Cost Estimate</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ${cost.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Timeline</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {Math.ceil(timeline / 7)} weeks
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Date</p>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => viewPrediction(item)}
                                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadPdf(item._id)}
                                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Download PDF"
                                        >
                                            <FaFilePdf />
                                        </button>
                                        <button
                                            onClick={() => handleDownloadCsv(item._id)}
                                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="Download CSV"
                                        >
                                            <FaFileCsv />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item._id)}
                                            disabled={deleting === item._id}
                                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;

