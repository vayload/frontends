import { PluginCard } from '../features/PluginCard';
import { clasnames } from '@/shared/utils';
import { usePluginsStore } from '@/store/plugin.store';
import { useShallow } from 'zustand/shallow';
import { useEffect } from 'react';
import { FilterStrategy } from '@/services/plugins.service';

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
			<div className="h-4 w-10 bg-neutral-800 rounded" />
		</div>

		<div className="flex justify-between items-center pt-4 border-t border-neutral-800/50">
			<div className="h-4 w-16 bg-neutral-800 rounded" />

			<div className="flex gap-2">
				<div className="h-6 w-16 bg-neutral-800 rounded" />
				<div className="h-4 w-10 bg-neutral-800 rounded" />
			</div>
		</div>
	</div>
);
const PluginListSkeleton = ({ count = 5 }: { count?: number }) => (
	<div className="flex w-full gap-5 flex-col">
		{Array.from({ length: count }).map((_, i) => (
			<PluginCardSkeleton key={i} />
		))}
	</div>
);

export const BrowseSection = () => {
	const { findPluginsByStrategy, loading, setFilterStrategy } = usePluginsStore(
		useShallow((state) => ({
			findPluginsByStrategy: state.findPluginsByStrategy,
			loading: state.isFetching,
			setFilterStrategy: state.updateFilterStrategy,
		})),
	);

	const filterStrategy = usePluginsStore((state) => state.filterStrategy);

	useEffect(() => {
		findPluginsByStrategy(filterStrategy);
	}, [filterStrategy]);

	const plugins = usePluginsStore((state) => state.plugins);

	return (
		<section
			id="browse"
			className="max-w-6xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-700"
		>
			<div className="flex justify-between items-end mb-8">
				<div>
					<h2 className="text-2xl font-bold text-white mb-2">Featured Plugins</h2>
					<p className="text-neutral-500 text-sm">The most used plugins by the community this week.</p>
				</div>

				<div className="flex gap-2 text-sm">
					<button
						onClick={() => setFilterStrategy(FilterStrategy.SCORE)}
						className={clasnames(
							'cursor-pointer px-3 py-1 rounded-md transition-colors',
							filterStrategy === FilterStrategy.SCORE
								? 'bg-orange-500/10 text-orange-500'
								: 'text-neutral-400 hover:text-white',
						)}
					>
						Trending
					</button>

					<button
						onClick={() => setFilterStrategy(FilterStrategy.LATEST)}
						className={clasnames(
							'cursor-pointer px-3 py-1 rounded-md transition-colors',
							filterStrategy === FilterStrategy.LATEST
								? 'bg-orange-500/10 text-orange-500'
								: 'text-neutral-400 hover:text-white',
						)}
					>
						New Entries
					</button>

					<button
						onClick={() => setFilterStrategy(FilterStrategy.PAID)}
						className={clasnames(
							'cursor-pointer px-3 py-1 rounded-md transition-colors',
							filterStrategy === FilterStrategy.PAID
								? 'bg-orange-500/10 text-orange-500'
								: 'text-neutral-400 hover:text-white',
						)}
					>
						Premium
					</button>
				</div>
			</div>

			{loading ? (
				<PluginListSkeleton count={5} />
			) : (
				<div className="flex w-full gap-5 flex-col">
					{plugins.items.map((plugin) => (
						<PluginCard key={plugin.id} plugin={plugin} />
					))}
				</div>
			)}
		</section>
	);
};
