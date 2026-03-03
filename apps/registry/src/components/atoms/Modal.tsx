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
                <div className="flex px-6">
                    <div className="flex items-center justify-between w-full border-b border-neutral-800/50 py-4">
                        {title && <h3 className="text-lg font-bold text-neutral-200">{title}</h3>}
                        <button
                            onClick={onClose}
                            className="text-neutral-400 p-2 bg-neutral-800 rounded-full hover:text-white transition-colors"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
                <div className="p-6">{children}</div>
                {footer && <div className="px-6 py-4">{footer}</div>}
            </div>
        </div>
    );
};
