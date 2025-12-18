import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewPrediction from './pages/NewPrediction';
import PredictionResult from './pages/PredictionResult';
import History from './pages/History';
import Compare from './pages/Compare';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/predict/new" element={<NewPrediction />} />
                <Route path="/predict/result" element={<PredictionResult />} />
                <Route path="/predict/history" element={<History />} />
                <Route path="/predict/compare" element={<Compare />} />

                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
