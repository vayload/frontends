import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Globe, Package } from 'lucide-react';

export interface SelectOption {
	value: string;
	label: string;
	description?: string;
	icon?: React.ReactNode;
}

interface CustomSelectProps {
	options: SelectOption[];
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	className?: string;
}

export const CustomSelect = ({
	options,
	value,
	onChange,
	placeholder = 'Select an option...',
	label,
	error,
	className = '',
}: CustomSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState('');
	const containerRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === value);

	const filteredOptions = options.filter(
		(opt) =>
			opt.label.toLowerCase().includes(search.toLowerCase()) ||
			opt.description?.toLowerCase().includes(search.toLowerCase()),
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className={`relative space-y-1.5 ${className}`} ref={containerRef}>
			{label && <label className="text-sm font-medium text-neutral-400">{label}</label>}

			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className={`w-full flex items-center justify-between bg-neutral-950 border ${
					isOpen ? 'border-orange-500/50 ring-1 ring-orange-500/20' : 'border-neutral-800'
				} rounded-xl px-4 py-3 text-left transition-all hover:border-neutral-700 group ${
					error ? 'border-red-500' : ''
				}`}
			>
				<div className="flex items-center gap-3 overflow-hidden">
					<div className="text-orange-500 shrink-0">{selectedOption?.icon || <Globe size={18} />}</div>
					<div className="truncate">
						<p className="text-sm font-medium text-white truncate">
							{selectedOption?.label || placeholder}
						</p>
						{selectedOption?.description && (
							<p className="text-xs text-neutral-500 truncate">{selectedOption.description}</p>
						)}
					</div>
				</div>
				<ChevronDown
					size={18}
					className={`text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute z-50 w-full mt-2 bg-neutral-950 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
					<div className="p-2 border-b border-neutral-900 flex items-center gap-2 bg-neutral-950/50 sticky top-0">
						<Search size={16} className="text-neutral-500 ml-2" />
						<input
							autoFocus
							type="text"
							className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-neutral-600 py-2"
							placeholder="Search..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</div>

					<div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
						{filteredOptions.length > 0 ? (
							filteredOptions.map((opt) => (
								<button
									key={opt.value}
									type="button"
									onClick={() => {
										onChange(opt.value);
										setIsOpen(false);
										setSearch('');
									}}
									className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
										value === opt.value
											? 'bg-orange-500/10 text-orange-500'
											: 'hover:bg-neutral-900 text-neutral-400 hover:text-white'
									}`}
								>
									<div className="flex items-center gap-3 overflow-hidden">
										<div className={value === opt.value ? 'text-orange-500' : 'text-neutral-500'}>
											{opt.icon || <Package size={18} />}
										</div>
										<div className="truncate">
											<p className="text-sm font-medium truncate">{opt.label}</p>
											{opt.description && (
												<p className="text-[11px] text-neutral-500 truncate">
													{opt.description}
												</p>
											)}
										</div>
									</div>
									{value === opt.value && <Check size={16} />}
								</button>
							))
						) : (
							<div className="p-8 text-center">
								<p className="text-sm text-neutral-500">No results found</p>
							</div>
						)}
					</div>
				</div>
			)}

			{error && <p className="text-xs text-red-500">{error}</p>}
		</div>
	);
};
