import { twMerge } from 'tailwind-merge';

export const Input = ({ label, className, error, ...props }) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    'w-full px-4 py-2.5 rounded-lg border bg-white border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 transition-all',
                    error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
        </div>
    );
};
