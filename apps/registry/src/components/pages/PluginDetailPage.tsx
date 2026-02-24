import { useEffect, useState } from 'react';
import { PluginDetails } from '../features/PluginDetails';
import { usePluginsStore } from '@/store/plugin.store';
import { useShallow } from 'zustand/shallow';

export const PluginDetailPage = () => {
	const { findPluginByName } = usePluginsStore(
		useShallow((state) => ({
			findPluginByName: state.getPluginDetail,
		})),
	);

	const { plugin, loading } = usePluginsStore(
		useShallow((state) => ({
			plugin: state.plugin,
			loading: state.isLoadingPlugin,
		})),
	);

	useEffect(() => {
		const name = new URLSearchParams(window.location.search).get('name');
		if (!name) {
			return;
		}

		findPluginByName(name);
	}, []);

	if (loading) {
		return (
			<div className="max-w-5xl mx-auto px-6 py-20">
				<div className="animate-pulse space-y-6">
					<div className="h-6 w-64 bg-neutral-800 rounded" />
					<div className="h-4 w-96 bg-neutral-800 rounded" />
					<div className="h-48 bg-neutral-900 rounded-xl" />
				</div>
			</div>
		);
	}

	if (!plugin) {
		return (
			<div className="max-w-5xl mx-auto px-6 py-20 text-center">
				<h1 className="text-xl font-semibold text-neutral-200 mb-2">Plugin not found</h1>
				<p className="text-neutral-500">The plugin you’re looking for does not exist or was removed.</p>
			</div>
		);
	}

	return <PluginDetails {...plugin} />;
};
