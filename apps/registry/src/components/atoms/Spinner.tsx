import type { HTMLAttributes } from 'react';

interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
	size?: 'xs' | 'sm' | 'md' | 'lg';
	variant?: 'primary' | 'white' | 'neutral';
}

export const Spinner = ({ size = 'md', variant = 'primary', className = '', ...props }: SpinnerProps) => {
	const sizes = {
		xs: 'w-3 h-3 border',
		sm: 'w-4 h-4 border-2',
		md: 'w-6 h-6 border-2',
		lg: 'w-8 h-8 border-3',
	};

	const variants = {
		primary: 'border-orange-600/30 border-t-orange-600',
		white: 'border-white/30 border-t-white',
		neutral: 'border-neutral-800 border-t-neutral-400',
	};

	return (
		<div
			className={`inline-block animate-spin rounded-full ${sizes[size]} ${variants[variant]} ${className}`}
			role="status"
			aria-label="loading"
			{...props}
		>
			<span className="sr-only">Loading...</span>
		</div>
	);
};
