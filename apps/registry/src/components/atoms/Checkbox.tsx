import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: string;
}

export const Checkbox = ({ label, className = '', disabled, ...props }: CheckboxProps) => {
	return (
		<label
			className={`flex items-center gap-2 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
		>
			<div className="relative flex items-center justify-center">
				<input
					type="checkbox"
					disabled={disabled}
					className="peer appearance-none w-5 h-5 bg-neutral-950 border border-neutral-800 rounded checked:bg-orange-600 checked:border-orange-600 transition-all outline-none focus:ring-2 focus:ring-orange-500/20"
					{...props}
				/>
				<svg
					className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="4"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="20 6 9 17 4 12"></polyline>
				</svg>
			</div>
			{label && (
				<span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{label}</span>
			)}
		</label>
	);
};
