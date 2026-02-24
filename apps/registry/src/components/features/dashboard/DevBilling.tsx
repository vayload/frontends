import { Check } from 'lucide-react';
import { Card } from '../../atoms/Card';
import { Badge } from '../../atoms/Badge';
import { Button } from '../../atoms/Button';

export const DevBilling = () => (
	<div className="space-y-6 animate-in fade-in duration-500">
		<div className="border-b border-neutral-800 pb-4 mb-6">
			<h2 className="text-2xl font-bold text-white">Billing and Plans</h2>
			<p className="text-neutral-500 text-sm mt-1">Manage your subscription and payment methods.</p>
		</div>

		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card className="flex flex-col h-full">
				<div className="flex justify-between items-start mb-4">
					<h3 className="font-semibold text-lg text-white">Plan "Dev Core"</h3>
					<Badge variant="success">Activo</Badge>
				</div>

				<div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
					<div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
						<Check size={16} /> Unlimited Public Plugins
					</div>
				</div>

				<div className="mt-auto">
					<p className="text-sm text-neutral-500 mb-2">Auto-renewal on Feb 01, 2026</p>
				</div>
			</Card>

			<Card>
				<h3 className="font-semibold text-lg text-white mb-4">Monthly Invoice</h3>
				<div className="mb-6">
					<span className="text-xs text-neutral-500 uppercase tracking-wider font-bold">Amount to pay</span>
					<p className="text-4xl font-bold text-white mt-1">$0.00</p>
					<p className="text-sm text-neutral-500 mt-2">No pending charges this month.</p>
				</div>
				<div className="border-t border-neutral-800 pt-4">
					<a href="#" className="text-sm text-orange-500 hover:text-orange-400 font-medium">
						View invoice history &rarr;
					</a>
				</div>
			</Card>

			<Card className="md:col-span-2 border-orange-500/20 bg-linear-to-br from-neutral-900 to-neutral-900/80">
				<h3 className="font-semibold text-lg text-white mb-4">Upgrade Plan</h3>
				<p className="text-neutral-400 text-sm mb-6">
					Upgrade to <strong>Vayload Pro</strong> plan to unlock private repositories and advanced analytics.
				</p>

				<div className="bg-neutral-950/50 border border-neutral-800 rounded-lg p-6 mb-6">
					<h4 className="text-sm font-medium text-neutral-300 mb-4 uppercase tracking-wider">
						Pro Benefits:
					</h4>
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
						{[
							'Publish Private Plugins (Invitation Only)',
							'Real-time download analytics',
							"'Verified Developer' Badge",
							'Priority Support',
						].map((item, i) => (
							<li key={i} className="flex items-center gap-2 text-sm text-neutral-300">
								<Check size={14} className="text-orange-500" /> {item}
							</li>
						))}
					</ul>
				</div>

				<div className="flex items-center gap-4">
					<Button>Upgrade Plan ($7/mes)</Button>
					<Button variant="ghost">Contact Sales</Button>
				</div>
			</Card>
		</div>
	</div>
);
