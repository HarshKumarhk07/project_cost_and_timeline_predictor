import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import adminApi from '../services/adminApi';
import { FaUsers, FaChartLine, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const load = async () => {
            try {
                const [uRes, pRes] = await Promise.all([
                    adminApi.getAllUsers(),
                    adminApi.getAllPredictions()
                ]);
                setUsers(uRes.data.data || []);
                setPredictions(pRes.data.data || []);
            } catch (err) {
                console.error('Failed to load admin data:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader />
            </div>
        );
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'users', label: `Users (${users.length})` },
        { id: 'predictions', label: `Predictions (${predictions.length})` },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Console</h1>
                <p className="text-gray-600">Manage users and view all predictions</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-l-4 border-indigo-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                                    <p className="text-4xl font-bold text-gray-900">{users.length}</p>
                                </div>
                                <div className="p-4 bg-indigo-100 rounded-lg">
                                    <FaUsers className="text-3xl text-indigo-600" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-l-4 border-purple-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 mb-1">Total Predictions</p>
                                    <p className="text-4xl font-bold text-gray-900">{predictions.length}</p>
                                </div>
                                <div className="p-4 bg-purple-100 rounded-lg">
                                    <FaChartLine className="text-3xl text-purple-600" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Users</h2>
                            <div className="space-y-3">
                                {users.slice(0, 5).map(u => (
                                    <div key={u._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{u.name}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <FaEnvelope className="text-xs" />
                                                {u.email}
                                            </p>
                                        </div>
                                        {u.role === 'admin' && (
                                            <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                                                Admin
                                            </span>
                                        )}
                                    </div>
                                ))}
                                {users.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">No users found</p>
                                )}
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Predictions</h2>
                            <div className="space-y-3">
                                {predictions.slice(0, 5).map(p => {
                                    const cost = p.outputs?.cost?.estimatedCost || p.outputs?.estimatedCost || 0;
                                    return (
                                        <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div>
                                                <p className="font-medium text-gray-900">{p.title}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <span>{p.projectType}</span>
                                                    <span>•</span>
                                                    <span>${cost.toLocaleString()}</span>
                                                </p>
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    );
                                })}
                                {predictions.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">No predictions found</p>
                                )}
                            </div>
                        </Card>
                    </div>
                </>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">All Users</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{u.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                u.role === 'admin' 
                                                    ? 'bg-indigo-100 text-indigo-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {u.role || 'User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* Predictions Tab */}
            {activeTab === 'predictions' && (
                <Card>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">All Predictions</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cost
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {predictions.map(p => {
                                    const cost = p.outputs?.cost?.estimatedCost || p.outputs?.estimatedCost || 0;
                                    return (
                                        <tr key={p._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{p.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-600">
                                                    {p.user?.name || p.user?.email || 'Unknown'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                                    {p.projectType}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">${cost.toLocaleString()}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {predictions.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No predictions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminDashboard;

