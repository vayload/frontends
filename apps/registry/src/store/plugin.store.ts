import { create } from 'zustand';
import { pluginsService } from '@/services/plugins.service';
import {
	FilterStrategy,
	type PublicPluginListItem,
	type PublicPluginDetail,
	type PluginVersion,
	type PrivatePluginListItem,
} from '../models';
import { withMinimumDelay } from '@/shared/utils';

interface Paginatable<T> {
	items: T[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

export type PluginState = {
	plugins: Paginatable<PublicPluginListItem>;
	privatePlugins: PrivatePluginListItem[];
	plugin: PublicPluginDetail | null;
	versions: PluginVersion[];
	isLoading: boolean;
	isLoadingPlugin: boolean;
	error: string | null;
	isSearching: boolean;
	isFetching: boolean;
	isUploading: boolean;
	filterStrategy: FilterStrategy;
};

interface PluginActions {
	updateFilterStrategy: (strategy: FilterStrategy) => void;
	findPluginsByStrategy: (strategy: FilterStrategy) => Promise<void>;
	searchPlugins: (query: string) => Promise<void>;
	getPluginDetail: (slug: string) => Promise<void>;
	getPluginVersions: (pluginId: string) => Promise<void>;
	fetchPrivatePlugins: (developerId: string) => Promise<void>;
	yankPlugin: (id: string) => Promise<void>;
	uploadPlugin: (file: File) => Promise<void>;
	clearError: () => void;
}

export const usePluginsStore = create<PluginState & PluginActions>((set, get) => ({
	plugins: {
		items: [],
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	},
	privatePlugins: [],
	plugin: null,
	versions: [],
	isLoading: false,
	error: null,
	isSearching: false,
	isFetching: false,
	isUploading: false,
	filterStrategy: FilterStrategy.LATEST,
	isLoadingPlugin: false,

	updateFilterStrategy: (strategy: FilterStrategy) => {
		set({ filterStrategy: strategy });
	},

	findPluginsByStrategy: async (strategy: FilterStrategy) => {
		set({ isFetching: true, error: null });

		const plugins = await withMinimumDelay(pluginsService.findPublicPlugins({ strategy }));
		plugins.match({
			ok: (items) => {
				set((state) => ({
					plugins: { ...state.plugins, items },
					isFetching: false,
				}));
			},
			err: (error) => {
				set((state) => ({
					error: error.message || 'Failed to fetch plugins',
					isFetching: false,
				}));
			},
		});
	},

	searchPlugins: async (query: string) => {
		set({ isSearching: true, error: null });

		const plugins = await withMinimumDelay(pluginsService.findPublicPlugins({ search: query }));
		plugins.match({
			ok: (items) => {
				set((state) => ({
					plugins: { ...state.plugins, items },
					isSearching: false,
				}));
			},
			err: (error) => {
				set((state) => ({
					error: error.message || 'Failed to search plugins',
					isSearching: false,
				}));
			},
		});
	},

	getPluginDetail: async (slug: string) => {
		set({ isLoadingPlugin: true, error: null });

		const result = await pluginsService.getPluginDetail(slug);
		result.match({
			ok: (plugin) => set({ plugin, isLoadingPlugin: false }),
			err: (error) => set({ error: error.message || 'Failed to find plugin', isLoadingPlugin: false }),
		});
	},

	getPluginVersions: async (pluginId: string) => {
		set({ isLoading: true, error: null });

		const result = await pluginsService.getPluginVersions(pluginId);
		result.match({
			ok: (versions) => set({ versions, isLoading: false }),
			err: (error) => set({ error: error.message || 'Failed to fetch versions', isLoading: false }),
		});
	},

	fetchPrivatePlugins: async (_developerId: string) => {
		set({ isFetching: true, error: null });

		const result = await withMinimumDelay(pluginsService.findDeveloperPlugins({}));

		result.match({
			ok: (privatePlugins) => set({ privatePlugins, isFetching: false }),
			err: (error) => set({ error: error.message || 'Failed to fetch your plugins', isFetching: false }),
		});
	},

	yankPlugin: async (id: string) => {
		const result = await pluginsService.yankPlugin(id);
		result.match({
			ok: () => {
				set({
					privatePlugins: get().privatePlugins.map((p) =>
						p.id === id ? { ...p, status: 'yanked' as any } : p,
					),
				});
			},
			err: (error) => set({ error: error.message || 'Failed to yank plugin' }),
		});
	},

	uploadPlugin: async (file: File) => {
		set({ isUploading: true, error: null });

		const result = await pluginsService.uploadPlugin(file);

		result.match({
			ok: (newPlugin) => {
				set((state) => ({
					privatePlugins: [newPlugin, ...state.privatePlugins],
					isUploading: false,
				}));
			},
			err: (error) => {
				set({ error: error.message || 'Failed to upload plugin', isUploading: false });
			},
		});
	},

	clearError: () => set({ error: null }),
}));
