import { Terminal, Star, Download, ChevronRight, Copy } from 'lucide-react';
import { Badge } from '../atoms/Badge.tsx';
import { Button } from '../atoms/Button.tsx';
import type { PublicPluginListItem } from '../../models.ts';
import { formatNumber } from '@/shared/format.utils';

interface PluginCardProps {
	plugin: PublicPluginListItem;
}

export const PluginCard = ({ plugin }: PluginCardProps) => {
	const installCommand = `vayload plug install ${plugin.name}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(installCommand);
	};

	return (
		<div className="group bg-neutral-900/50 border border-neutral-800 hover:border-orange-500/50 rounded-xl p-5 transition-all duration-300 hover:bg-neutral-900">
			<div className="flex justify-between items-start mb-4">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-orange-500 group-hover:text-white group-hover:bg-orange-600 transition-colors">
						<Terminal size={20} />
					</div>
					<div>
						<h3 className="font-semibold text-neutral-100 leading-tight group-hover:text-orange-400 transition-colors">
							{plugin.displayName}
						</h3>
						<div className="flex items-center gap-2 mt-1">
							{plugin.owner.avatarUrl && (
								<img
									src={plugin.owner.avatarUrl}
									alt={plugin.owner.username}
									className="w-4 h-4 rounded-full"
								/>
							)}
							<p className="text-xs text-neutral-500">by {plugin.owner.username}</p>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-1 text-xs font-medium bg-neutral-950 border border-neutral-800 px-2 py-1 rounded text-neutral-400">
					<Star size={12} className="text-orange-500 fill-orange-500" /> 4.5
				</div>
			</div>

			<p className="text-sm text-neutral-400 mb-4 line-clamp-2">{plugin.description}</p>

			<div className="flex flex-wrap gap-2 mb-4">
				{plugin.tags.map((tag, i) => (
					<Badge key={i} variant="neutral" className="text-[10px] uppercase tracking-wider font-semibold">
						{tag}
					</Badge>
				))}
				<Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
					{plugin.pricingType}
				</Badge>
			</div>

			<div className="flex items-center justify-between pt-4 border-t border-neutral-800/50">
				<span className="text-xs text-neutral-500 flex items-center gap-1">
					<Download size={12} /> {formatNumber(plugin.totalDownloads)}
				</span>

				<div className="flex items-center gap-3">
					<Button
						variant="secondary"
						size="sm"
						onClick={copyToClipboard}
						className="h-7 text-xs font-mono"
						leftIcon={<Copy size={12} />}
					>
						Install
					</Button>

					<a
						href={`/plugins?name=${plugin.name}`}
						className="cursor-pointer text-xs font-medium text-orange-500 hover:text-orange-400 flex items-center gap-1"
					>
						View <ChevronRight size={12} />
					</a>
				</div>
			</div>
		</div>
	);
};
