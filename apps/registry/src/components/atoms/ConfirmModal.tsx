import { AlertTriangle, Info } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { ReactNode } from 'react';

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void | Promise<void>;
	title: string;
	message: string | ReactNode;
	confirmText?: string;
	cancelText?: string;
	variant?: 'primary' | 'danger';
	isLoading?: boolean;
}

export const ConfirmModal = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	variant = 'primary',
	isLoading = false,
}: ConfirmModalProps) => {
	const handleConfirm = async () => {
		await onConfirm();
		onClose();
	};

	const Icon = variant === 'danger' ? AlertTriangle : Info;
	const iconColor = variant === 'danger' ? 'text-red-500' : 'text-orange-500';
	const iconBg = variant === 'danger' ? 'bg-red-500/10 border-red-500/20' : 'bg-orange-500/10 border-orange-500/20';

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			footer={
				<div className="flex gap-3 w-full">
					<Button variant="ghost" onClick={onClose} className="flex-1" disabled={isLoading}>
						{cancelText}
					</Button>
					<Button
						variant={variant === 'danger' ? 'danger' : 'primary'}
						onClick={handleConfirm}
						className="flex-1"
						isLoading={isLoading}
						disabled={isLoading}
					>
						{confirmText}
					</Button>
				</div>
			}
		>
			<div className="text-center p-4">
				<div
					className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border ${iconBg}`}
				>
					<Icon size={28} className={iconColor} />
				</div>
				<h3 className="text-white font-semibold mb-2">{title}</h3>
				<div className="text-neutral-400 text-sm leading-relaxed mb-4">
					{typeof message === 'string' ? <p>{message}</p> : message}
				</div>
			</div>
		</Modal>
	);
};
