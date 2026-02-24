import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
	error?: string;
	children: React.ReactNode;
}

export const Select = ({ children, className = '', error, ...props }: SelectProps) => {
	return (
		<div className="space-y-1.5 w-full">
			<select
				className={`w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-orange-500 transition-all text-sm appearance-none disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
				style={{
					backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a3a3a3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'right 1rem center',
					backgroundSize: '1rem',
				}}
				{...props}
			>
				{children}
			</select>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
};
