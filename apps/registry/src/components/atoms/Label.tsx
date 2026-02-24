import type { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
	children: React.ReactNode;
}

export const Label = ({ children, className = '', ...props }: LabelProps) => {
	return (
		<label className={`text-xs font-semibold text-neutral-400 uppercase tracking-wider ${className}`} {...props}>
			{children}
		</label>
	);
};
