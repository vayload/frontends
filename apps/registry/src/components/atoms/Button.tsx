import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
	size?: 'sm' | 'md' | 'lg' | 'icon';
	leftIcon?: ReactNode;
	rightIcon?: ReactNode;
	isLoading?: boolean;
	children?: ReactNode;
}

export const Button = ({
	children,
	variant = 'primary',
	size = 'md',
	leftIcon,
	rightIcon,
	isLoading = false,
	className = '',
	...props
}: ButtonProps) => {
	const variants = {
		primary: 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20',
		secondary: 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700',
		ghost: 'text-neutral-400 hover:text-white hover:bg-neutral-800/50',
		outline: 'border border-neutral-600 text-neutral-300 hover:border-neutral-400 hover:text-white',
		danger: 'bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white',
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-xs',
		md: 'px-5 py-2.5 text-sm',
		lg: 'px-8 py-3 text-base',
		icon: 'p-2',
	};

	return (
		<button
			className={`rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`}
			disabled={props.disabled || isLoading}
			{...props}
		>
			{isLoading ? (
				<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
			) : (
				<>
					{leftIcon && <span className="flex items-center">{leftIcon}</span>}
					{children}
					{rightIcon && <span className="flex items-center">{rightIcon}</span>}
				</>
			)}
		</button>
	);
};
