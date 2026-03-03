import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
}

export const Input = ({ className = '', error, ...props }: InputProps) => {
    return (
        <div className="space-y-1.5 w-full">
            <input
                className={`w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-orange-500 transition-all text-sm placeholder:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};
