import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { FaChartLine, FaClock, FaShieldAlt, FaFileAlt } from 'react-icons/fa';
import heroImage from '../assets/hero-v2.png';
import featuresImage from '../assets/features-bg.png';
import uploadIcon from '../assets/step-upload.png';
import aiIcon from '../assets/step-ai.png';
import resultIcon from '../assets/step-success.png';
import constructionImg from '../assets/usecase-construction.png';
import softwareImg from '../assets/usecase-software.png';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                ProjectCostAI
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                                Sign In
                            </Link>
                            <Link to="/register">
                                <Button>Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Predict. Plan. Succeed.
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
                                AI-Driven Project Intelligence
                            </span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                            Stop guessing. Start knowing. Our advanced AI analyzes your project parameters to provide pinpoint accurate cost and timeline estimates, helping you deliver on time and under budget.
                        </p>
                        <div className="flex justify-center lg:justify-start">
                            <Link to="/register">
                                <Button className="text-lg px-8 py-3 bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
                                    Start Estimation
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="lg:w-1/2">
                        <img
                            src={heroImage}
                            alt="AI Project Analytics Dashboard"
                            className="w-full h-auto rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
                            Comprehensive project analysis tools to help you plan better
                        </p>
                        <div className="flex justify-center mb-12">
                            <img
                                src={featuresImage}
                                alt="Analytics Features"
                                className="w-full max-w-2xl h-auto rounded-xl shadow-lg border border-gray-200"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Cost Prediction */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <FaChartLine className="text-2xl text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Cost Prediction
                            </h3>
                            <p className="text-gray-600">
                                Accurate cost estimates based on project parameters, team size, and complexity.
                            </p>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                <FaClock className="text-2xl text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Timeline Estimation
                            </h3>
                            <p className="text-gray-600">
                                Realistic project timelines considering all factors and dependencies.
                            </p>
                        </div>

                        {/* Risk Analysis */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                                <FaShieldAlt className="text-2xl text-amber-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Risk Analysis
                            </h3>
                            <p className="text-gray-600">
                                Identify potential risks and get recommendations to mitigate them.
                            </p>
                        </div>

                        {/* Reports */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                <FaFileAlt className="text-2xl text-teal-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Detailed Reports
                            </h3>
                            <p className="text-gray-600">
                                Export comprehensive reports in PDF or CSV format for stakeholders.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">From data to decision in three simple steps</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-indigo-50 rounded-2xl p-6 mb-6 w-48 h-48 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                                <img src={uploadIcon} alt="Upload" className="w-32 h-32 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">1. Upload Data</h3>
                            <p className="text-gray-600">Input your project parameters, team size, and historical data.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-purple-50 rounded-2xl p-6 mb-6 w-48 h-48 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                                <img src={aiIcon} alt="AI Processing" className="w-32 h-32 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">2. AI Analysis</h3>
                            <p className="text-gray-600">Our advanced ML models analyze patterns and potential risks.</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-emerald-50 rounded-2xl p-6 mb-6 w-48 h-48 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                                <img src={resultIcon} alt="Results" className="w-32 h-32 object-contain" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">3. Get Insights</h3>
                            <p className="text-gray-600">Receive accurate cost predictions and timeline estimates instantly.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Every Industry</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Tailored predictions for your specific domain</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                            <img src={constructionImg} alt="Construction" className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Construction & Engineering</h3>
                                <p className="text-gray-200">Optimize material costs, labor planning, and site timelines with precision.</p>
                            </div>
                        </div>
                        <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                            <img src={softwareImg} alt="Software" className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-bold text-white mb-2">Software Development</h3>
                                <p className="text-indigo-100">Predict sprint velocities, resource allocation, and delivery dates accurately.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of project managers making smarter decisions with AI-powered predictions.
                    </p>
                    <Link to="/register">
                        <Button variant="secondary" className="text-lg px-8 py-4 bg-white text-indigo-600 hover:bg-gray-50">
                            Start Your First Prediction
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-gray-600">
                        <p>&copy; {new Date().getFullYear()} ProjectCostAI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div >
    );
};

export default Landing;

