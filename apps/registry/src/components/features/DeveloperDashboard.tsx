import { useMemo, useState, useEffect } from 'react';
import { User, Box, CreditCard, Key } from 'lucide-react';
import { DevPackages } from './dashboard/DevPackages';
import { DevTokens } from './dashboard/DevTokens';
import { DevProfile } from './dashboard/DevProfile';

export const DeveloperDashboard = () => {
	const [activeTab, setActiveTab] = useState('profile');

	const menuItems = [
		{ id: 'profile', label: 'Profile', icon: User, component: DevProfile },
		{ id: 'packages', label: 'Plugins', icon: Box, component: DevPackages },
		{ id: 'api-tokens', label: 'API Tokens', icon: Key, component: DevTokens },
		{ id: 'billing', label: 'Billing', icon: CreditCard, comingSoon: true },
	];

	const Component = useMemo(() => menuItems.find((item) => item.id === activeTab)?.component, [activeTab]);

	useEffect(() => {
		const query = new URLSearchParams(window.location.search);
		const tab = query.get('tab');
		if (tab && ['profile', 'packages', 'api-tokens'].includes(tab)) {
			setActiveTab(tab);
		}
	}, []);

	const handleTabChange = (tab: string) => {
		const item = menuItems.find((i) => i.id === tab);
		if (item?.comingSoon) return;
		setActiveTab(tab);
		window.history.replaceState(null, '', `?tab=${tab}`);
	};

	return (
		<div className="max-w-6xl mx-auto px-6 py-12 min-h-[calc(100vh-64px)]">
			<div className="space-y-8">
				<header>
					<nav className="flex items-center gap-1 -mx-4 overflow-x-auto">
						{menuItems.map((item) => (
							<button
								key={item.id}
								onClick={() => handleTabChange(item.id)}
								disabled={item.comingSoon}
								className={`cursor-pointer flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
									activeTab === item.id
										? 'border-orange-500 text-orange-500'
										: item.comingSoon
											? 'border-transparent text-neutral-500 cursor-not-allowed'
											: 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
								}`}
							>
								<item.icon size={18} />
								<span>{item.label}</span>
								{item.comingSoon && (
									<span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
										Coming Soon
									</span>
								)}
							</button>
						))}
						<span className="flex-1" />
						<button
							disabled
							className="cursor-not-allowed flex items-center gap-2 px-4 py-3 text-sm font-medium text-neutral-500 border-b-2 border-transparent"
						>
							<span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
								Coming Soon
							</span>
							Create Organization
						</button>
					</nav>
				</header>

				<div className="min-w-0">{Component && <Component />}</div>
			</div>
		</div>
	);
};
