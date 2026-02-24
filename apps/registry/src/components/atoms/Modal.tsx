import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	footer?: ReactNode;
	className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, footer, className = '' }: ModalProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
			<div
				className={`bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 ${className}`}
			>
				<div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
					{title && <h3 className="text-lg font-bold text-white">{title}</h3>}
					<button
						onClick={onClose}
						className="text-neutral-500 hover:text-white transition-colors"
						aria-label="Close modal"
					>
						<X size={20} />
					</button>
				</div>
				<div className="p-6">{children}</div>
				{footer && <div className="px-6 py-4 border-t border-neutral-800">{footer}</div>}
			</div>
		</div>
	);
};
