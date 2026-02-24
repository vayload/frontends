import { PluginCard } from '../features/PluginCard';
import { clasnames } from '@/shared/utils';
import { usePluginsStore, type PluginState } from '@/store/plugin.store';
import { useShallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';
import { FilterStrategy, type PublicPluginListItem } from '../../models';
import { Search, ChevronRight, ListFilter } from 'lucide-react';

const PluginCardSkeleton = () => (
	<div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-5 animate-pulse">
		<div className="flex justify-between items-start mb-4">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-lg bg-neutral-800" />
				<div className="space-y-2">
					<div className="h-4 w-32 bg-neutral-800 rounded" />
					<div className="h-3 w-20 bg-neutral-800 rounded" />
				</div>
			</div>
			<div className="h-5 w-10 bg-neutral-800 rounded" />
		</div>
		<div className="flex gap-2 mb-4">
			<div className="h-4 w-12 bg-neutral-800 rounded" />
			<div className="h-4 w-16 bg-neutral-800 rounded" />
		</div>
		<div className="flex justify-between items-center pt-4 border-t border-neutral-800/50">
			<div className="h-4 w-16 bg-neutral-800 rounded" />
			<div className="h-6 w-16 bg-neutral-800 rounded" />
		</div>
	</div>
);

export const HeroBrowseSection = () => {
	const { findPluginsByStrategy, loading, setFilterStrategy, filterStrategy, plugins } = usePluginsStore(
		useShallow((state: PluginState & any) => ({
			findPluginsByStrategy: state.findPluginsByStrategy,
			loading: state.isFetching,
			setFilterStrategy: state.updateFilterStrategy,
			filterStrategy: state.filterStrategy,
			plugins: state.plugins,
		})),
	);

	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		findPluginsByStrategy(filterStrategy);
	}, [filterStrategy]);

	const filteredPlugins = plugins.items.filter(
		(plugin: PublicPluginListItem) =>
			plugin.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
			plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(plugin.description && plugin.description.toLowerCase().includes(searchQuery.toLowerCase())),
	);

	return (
		<div className="relative group animate-in slide-in-from-right-8 fade-in duration-1000 delay-200">
			<div className="relative overflow-hidden flex flex-col h-[640px]">
				<div className="p-4 space-y-6">
					<div className="flex items-center justify-between">
						<div className="flex gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
							<button
								onClick={() => setFilterStrategy(FilterStrategy.SCORE)}
								className={clasnames(
									'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
									filterStrategy === FilterStrategy.SCORE
										? 'bg-neutral-800 text-white shadow-sm'
										: 'text-neutral-500 hover:text-neutral-300',
								)}
							>
								Trending
							</button>
							<button
								onClick={() => setFilterStrategy(FilterStrategy.LATEST)}
								className={clasnames(
									'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
									filterStrategy === FilterStrategy.LATEST
										? 'bg-neutral-800 text-white shadow-sm'
										: 'text-neutral-500 hover:text-neutral-300',
								)}
							>
								Latest
							</button>
							<button
								onClick={() => setFilterStrategy(FilterStrategy.PAID)}
								className={clasnames(
									'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
									filterStrategy === FilterStrategy.PAID
										? 'bg-neutral-800 text-white shadow-sm'
										: 'text-neutral-500 hover:text-neutral-300',
								)}
							>
								Premium
							</button>
						</div>

						<button className="p-2 text-neutral-500 hover:text-white transition-colors">
							<ListFilter size={18} />
						</button>
					</div>
				</div>

				<div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
					{loading ? (
						Array.from({ length: 2 }).map((_, i) => <PluginCardSkeleton key={i} />)
					) : filteredPlugins.length > 0 ? (
						filteredPlugins.map((plugin: PublicPluginListItem) => (
							<div key={plugin.id} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
								<PluginCard plugin={plugin} />
							</div>
						))
					) : (
						<div className="h-full flex flex-col items-center justify-center text-center py-20">
							<div className="p-4 bg-neutral-950 rounded-full mb-4 border border-neutral-800">
								<Search size={32} className="text-neutral-700" />
							</div>
							<p className="text-neutral-400 font-medium">No plugins found</p>
							<p className="text-neutral-600 text-xs mt-1">Try adjusting your search or filters</p>
						</div>
					)}
				</div>
				<div className="p-4 flex justify-center">
					<a
						href="/explore"
						className="text-xs text-orange-500 hover:text-orange-400 font-medium flex items-center gap-1 group/btn"
					>
						Browse All Ecosystem{' '}
						<ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
					</a>
				</div>
			</div>
		</div>
	);
};
