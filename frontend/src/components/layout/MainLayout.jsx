import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaHome, FaChartLine, FaHistory, FaSignOutAlt, FaBars, FaTimes, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';

const SidebarItem = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
            active
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
        }`}
    >
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
    </Link>
);

export const MainLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const items = [
        { to: "/dashboard", icon: <FaHome />, label: "Dashboard" },
        { to: "/predict/new", icon: <FaChartLine />, label: "New Prediction" },
        { to: "/predict/history", icon: <FaHistory />, label: "History" },
        { to: "/predict/compare", icon: <FaExchangeAlt />, label: "Compare" },
    ];

    if (user?.role === 'admin') {
        items.push({ to: "/admin", icon: <FaShieldAlt />, label: "Admin Console" });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar (Desktop) */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        ProjectCostAI
                    </h1>
                </div>
                <nav className="flex-1 px-4 py-4 overflow-y-auto">
                    {items.map(item => (
                        <SidebarItem
                            key={item.to}
                            {...item}
                            active={location.pathname === item.to}
                        />
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-500 mb-2">
                        {user?.name || user?.email}
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 text-red-600 hover:text-red-700 w-full px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    ProjectCostAI
                </h1>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="text-gray-600 hover:text-gray-900"
                >
                    {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 mt-16 md:mt-0 max-w-7xl mx-auto w-full">
                <Outlet />
            </main>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/50 md:hidden" 
                    onClick={() => setIsSidebarOpen(false)}
                >
                    <div 
                        className="bg-white w-64 h-full p-4 shadow-xl" 
                        onClick={e => e.stopPropagation()}
                    >
                        <nav className="flex flex-col space-y-2 mt-12">
                            {items.map(item => (
                                <SidebarItem
                                    key={item.to}
                                    {...item}
                                    active={location.pathname === item.to}
                                />
                            ))}
                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="px-4 py-2 text-sm text-gray-500 mb-2">
                                    {user?.name || user?.email}
                                </div>
                                <button 
                                    onClick={logout} 
                                    className="flex items-center space-x-3 text-red-600 px-4 py-3 rounded-lg hover:bg-red-50 w-full"
                                >
                                    <FaSignOutAlt /> 
                                    <span>Logout</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
};
