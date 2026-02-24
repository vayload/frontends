import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	error?: string;
}

export const Textarea = ({ className = '', error, ...props }: TextareaProps) => {
	return (
		<div className="space-y-1.5 w-full">
			<textarea
				className={`w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white outline-none focus:border-orange-500 transition-all text-sm placeholder:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed resize-none ${error ? 'border-red-500 focus:border-red-500' : ''} ${className}`}
				{...props}
			/>
			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
};
