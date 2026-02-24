import { useState } from 'react';
import { Copy, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Modal } from '../../atoms/Modal';

interface TokenCreatedModalProps {
	isOpen: boolean;
	tokenName: string;
	tokenValue: string;
	onClose: () => void;
}

export const TokenCreatedModal = ({ isOpen, tokenName, tokenValue, onClose }: TokenCreatedModalProps) => {
	const [isVisible, setIsVisible] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(tokenValue);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (!isOpen) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Token Created Successfully!">
			<div className="flex flex-col items-center text-center">
				<div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
					<CheckCircle2 size={24} className="text-emerald-400" />
				</div>

				<p className="text-neutral-400 text-sm mb-4">
					Make sure to copy your token now. You won't be able to see it again.
				</p>

				<div className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 mb-4 text-left">
					<p className="text-xs text-neutral-500 mb-1">{tokenName}</p>
					<div className="flex items-center gap-2">
						<code className="flex-1 font-mono text-sm text-neutral-300 truncate">
							{isVisible ? tokenValue : '•'.repeat(tokenValue.length)}
						</code>
						<button
							onClick={() => setIsVisible(!isVisible)}
							className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
							title={isVisible ? 'Hide token' : 'Show token'}
						>
							{isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
						</button>
						<button
							onClick={handleCopy}
							className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
							title="Copy to clipboard"
						>
							{copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
						</button>
					</div>
				</div>

				<div className="w-full bg-orange-900/20 border border-orange-900/50 rounded-lg p-3 mb-6">
					<p className="text-xs text-orange-400">
						⚠️ This token will only be shown once. Please store it securely.
					</p>
				</div>

				<Button variant="primary" onClick={onClose} className="w-full py-3">
					I've Saved My Token
				</Button>
			</div>
		</Modal>
	);
};
