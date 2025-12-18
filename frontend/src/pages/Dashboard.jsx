import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { FaPlus, FaChartLine, FaHistory, FaDollarSign, FaClock, FaCheckCircle } from 'react-icons/fa';
import predictionApi from '../services/predictionApi';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalPredictions: 0,
        avgCost: 0,
        avgTime: 0,
        loading: true
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await predictionApi.getHistory();
                const predictions = res.data.data || [];
                
                const totalPredictions = predictions.length;
                const costs = predictions
                    .filter(p => p.outputs?.cost?.estimatedCost || p.outputs?.estimatedCost)
                    .map(p => p.outputs?.cost?.estimatedCost || p.outputs?.estimatedCost);
                const timelines = predictions
                    .filter(p => p.outputs?.timeline?.estimatedDurationDays || p.outputs?.estimatedDuration)
                    .map(p => p.outputs?.timeline?.estimatedDurationDays || p.outputs?.estimatedDuration);

                const avgCost = costs.length > 0 
                    ? Math.round(costs.reduce((a, b) => a + b, 0) / costs.length)
                    : 0;
                const avgTime = timelines.length > 0
                    ? Math.round(timelines.reduce((a, b) => a + b, 0) / timelines.length)
                    : 0;

                setStats({
                    totalPredictions,
                    avgCost,
                    avgTime,
                    loading: false
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
                setStats(prev => ({ ...prev, loading: false }));
            }
        };

        fetchStats();
    }, []);

    const firstName = user?.name?.split(' ')[0] || 'User';

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {firstName}!
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Ready to analyze your next big project?
                    </p>
                </div>
                <Link to="/predict/new">
                    <Button className="flex items-center gap-2">
                        <FaPlus />
                        New Prediction
                    </Button>
                </Link>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-indigo-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Total Predictions</p>
                            {stats.loading ? (
                                <Loader />
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">{stats.totalPredictions}</p>
                            )}
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <FaChartLine className="text-2xl text-indigo-600" />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-emerald-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Average Cost</p>
                            {stats.loading ? (
                                <Loader />
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">
                                    ${stats.avgCost.toLocaleString()}
                                </p>
                            )}
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-lg">
                            <FaDollarSign className="text-2xl text-emerald-600" />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-teal-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 mb-1">Average Timeline</p>
                            {stats.loading ? (
                                <Loader />
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">
                                    {Math.round(stats.avgTime / 7)} weeks
                                </p>
                            )}
                        </div>
                        <div className="p-3 bg-teal-100 rounded-lg">
                            <FaClock className="text-2xl text-teal-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/predict/new">
                    <Card className="hover:shadow-lg transition-all border-l-4 border-indigo-500 cursor-pointer group h-full">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-100 rounded-lg group-hover:scale-110 transition-transform">
                                <FaPlus className="text-2xl text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">New Prediction</h3>
                                <p className="text-gray-600">
                                    Assess cost, risk, and timeline for a new project idea.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>

                <Link to="/predict/history">
                    <Card className="hover:shadow-lg transition-all border-l-4 border-emerald-500 cursor-pointer group h-full">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-emerald-100 rounded-lg group-hover:scale-110 transition-transform">
                                <FaHistory className="text-2xl text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-1">View History</h3>
                                <p className="text-gray-600">
                                    Check past analysis reports and export data.
                                </p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
