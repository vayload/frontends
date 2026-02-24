import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
	children: React.ReactNode;
}

export const Badge = ({ children, variant = 'neutral', className = '', ...props }: BadgeProps) => {
	const variants = {
		neutral: 'bg-neutral-800 text-neutral-300 border-neutral-700',
		primary: 'bg-orange-600/10 text-orange-500 border-orange-500/20',
		success: 'bg-emerald-600/10 text-emerald-500 border-emerald-500/20',
		warning: 'bg-amber-600/10 text-amber-500 border-amber-500/20',
		error: 'bg-red-600/10 text-red-500 border-red-500/20',
		outline: 'border-neutral-700 text-neutral-400',
	};

	return (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
			{...props}
		>
			{children}
		</span>
	);
};
