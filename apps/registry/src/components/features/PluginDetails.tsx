import { Terminal, Star, Download, User, Tag, FileText, Code, History, ChevronRight } from 'lucide-react';
import { MarkdownRenderer } from '../ui/MakdownRender';
import { usePluginsStore } from '@/store/plugin.store';
import { useEffect, useState } from 'react';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import type { PublicPluginDetail } from '../../models';
import { useShallow } from 'zustand/shallow';
import { formatDate, formatNumber } from '@/shared/format.utils';

export const PluginDetails = (plugin: PublicPluginDetail) => {
	const { versions, getPluginVersions } = usePluginsStore(
		useShallow((state) => ({
			versions: state.versions,
			getPluginVersions: state.getPluginVersions,
		})),
	);

	const [activeTab, setActiveTab] = useState<'readme' | 'changelog'>('readme');
	const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

	useEffect(() => {
		if (plugin) {
			getPluginVersions(plugin.id);
		}
	}, [plugin]);

	const selectedVersion = versions.find((v) => v.id === selectedVersionId) || versions[0];

	return (
		<div className="max-w-6xl mx-auto px-6 py-10">
			<div className="pb-6">
				<a
					href="/"
					className="text-xs text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1 group/btn"
				>
					Back to Ecosystem
				</a>
			</div>
			<div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-8">
				<div className="flex gap-4">
					<div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-orange-500 shadow-xl shadow-orange-500/5">
						<Terminal size={32} />
					</div>
					<div>
						<div className="flex items-center gap-2 mb-1">
							<h1 className="text-3xl font-bold text-white tracking-tight">{plugin.displayName}</h1>
							<Badge variant="outline" className="text-[10px]">
								{plugin.latestStableVersion}
							</Badge>
						</div>
						<p className="text-neutral-400 mb-3">{plugin.description}</p>
						<div className="flex items-center gap-4 text-xs">
							<div className="flex items-center gap-2 text-neutral-300">
								{plugin.owner.avatarUrl && (
									<img
										src={plugin.owner.avatarUrl}
										alt={plugin.owner.username}
										className="w-5 h-5 rounded-full"
									/>
								)}
								<span>{plugin.owner.username}</span>
							</div>
							<div className="flex items-center gap-1 text-neutral-400">
								<Star size={14} className="text-orange-500 fill-orange-500" />
								<span>
									{plugin.averageRating} ({plugin.reviewsCount} reviews)
								</span>
							</div>
							<div className="flex items-center gap-1 text-neutral-400">
								<Download size={14} />
								<span>{plugin.totalDownloads.toLocaleString()} downloads</span>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-3 min-w-[200px]">
					<Button className="w-full h-11" size="lg">
						Install Plugin
					</Button>
					<p className="text-[10px] text-center text-neutral-500 font-mono">vayload plug {plugin.name}</p>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mb-10">
				{plugin.tags.map((tag) => (
					<Badge key={tag} variant="neutral" className="px-3 py-1">
						{tag}
					</Badge>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
				<div className="lg:col-span-3">
					<div className="flex items-center border-b border-neutral-800 mb-6">
						<button
							onClick={() => setActiveTab('readme')}
							className={`px-6 py-3 text-sm font-medium transition-colors relative ${
								activeTab === 'readme' ? 'text-orange-500' : 'text-neutral-500 hover:text-neutral-300'
							}`}
						>
							README.md
							{activeTab === 'readme' && (
								<div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
							)}
						</button>
						<button
							onClick={() => setActiveTab('changelog')}
							className={`px-6 py-3 text-sm font-medium transition-colors relative ${
								activeTab === 'changelog'
									? 'text-orange-500'
									: 'text-neutral-500 hover:text-neutral-300'
							}`}
						>
							Changelog
							{activeTab === 'changelog' && (
								<div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />
							)}
						</button>
					</div>

					<div className="bg-neutral-900/40 border border-neutral-800/50 rounded-2xl p-8 min-h-[400px]">
						{activeTab === 'readme' ? (
							<div className="prose prose-invert prose-orange max-w-none">
								<MarkdownRenderer content={plugin.readme || 'No documentation provided.'} />
							</div>
						) : (
							<div className="prose prose-invert prose-orange max-w-none">
								<MarkdownRenderer content={selectedVersion?.changelog || 'No changelog available.'} />
							</div>
						)}
					</div>
				</div>

				<div className="space-y-6">
					<div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
						<h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
							<History size={16} className="text-orange-500" />
							Version History
						</h3>
						<div className="space-y-3">
							{versions.map((v) => (
								<button
									key={v.id}
									onClick={() => {
										setSelectedVersionId(v.id);
										setActiveTab('changelog');
									}}
									className={`w-full text-left p-3 rounded-xl border transition-all ${
										selectedVersionId === v.id ||
										(selectedVersionId === null && versions[0]?.id === v.id)
											? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
											: 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
									}`}
								>
									<div className="flex justify-between items-center mb-1">
										<span className="font-mono text-xs font-bold">{v.version}</span>
										<Badge variant="neutral" className="text-[9px] px-1 py-0 h-4">
											{v.status}
										</Badge>
									</div>
									<div className="text-[10px] text-neutral-500 flex justify-between">
										<span>{formatDate(v.publisheAt)}</span>
										<span>{formatNumber(v.downloadsCount)} dl</span>
									</div>
								</button>
							))}
						</div>
					</div>

					<div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6">
						<h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
							<Code size={16} className="text-orange-500" />
							Project Links
						</h3>
						<div className="space-y-3">
							{plugin.homepageUrl && (
								<a
									href={plugin.homepageUrl}
									target="_blank"
									className="flex items-center justify-between text-xs text-neutral-400 hover:text-orange-400 transition-colors"
								>
									Homepage <ChevronRight size={14} />
								</a>
							)}
							{plugin.repoUrl && (
								<a
									href={plugin.repoUrl}
									target="_blank"
									className="flex items-center justify-between text-xs text-neutral-400 hover:text-orange-400 transition-colors"
								>
									Repository <ChevronRight size={14} />
								</a>
							)}
							{plugin.documentationUrl && (
								<a
									href={plugin.documentationUrl}
									target="_blank"
									className="flex items-center justify-between text-xs text-neutral-400 hover:text-orange-400 transition-colors"
								>
									Documentation <ChevronRight size={14} />
								</a>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
