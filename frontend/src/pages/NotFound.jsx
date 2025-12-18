import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
            <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
            <p className="text-xl text-gray-700 mt-4 mb-8">Page not found</p>
            <Link to="/dashboard">
                <Button>Go back home</Button>
            </Link>
        </div>
    );
};

export default NotFound;
