import type { InputHTMLAttributes } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
	label?: string;
}

export const Toggle = ({ label, className = '', disabled, ...props }: ToggleProps) => {
	return (
		<label
			className={`flex items-center gap-3 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
		>
			<div className="relative inline-flex items-center">
				<input type="checkbox" role="switch" disabled={disabled} className="peer sr-only" {...props} />
				<div className="w-10 h-6 bg-neutral-800 rounded-full peer peer-checked:bg-orange-600 transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
			</div>
			{label && (
				<span className="text-sm text-neutral-300 group-hover:text-white transition-colors">{label}</span>
			)}
		</label>
	);
};
