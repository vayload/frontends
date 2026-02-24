import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
	title?: string;
	description?: string;
	children: React.ReactNode;
}

export const Card = ({ title, description, children, className = '', ...props }: CardProps) => {
	return (
		<div
			className={`bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl ${className}`}
			{...props}
		>
			{(title || description) && (
				<div className="px-6 py-4 border-b border-neutral-800">
					{title && <h3 className="text-lg font-bold text-white">{title}</h3>}
					{description && <p className="text-sm text-neutral-400 mt-1">{description}</p>}
				</div>
			)}
			<div className="p-6">{children}</div>
		</div>
	);
};
