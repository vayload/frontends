import { httpClient } from '@/shared/httpClient';
import {
	type PublicPluginListItem,
	type PublicPluginDetail,
	type PublicPluginFilters,
	type PrivatePluginListItem,
	type PrivatePluginFilters,
	type PluginVersion,
	FilterStrategy,
} from '../models';
import type { Result } from '@/common/rusty';
import type { HttpError } from '@/common/HttpClient';

export class PluginsService {
	private mapToPublicListItem(p: any): PublicPluginListItem {
		return {
			id: p.id,
			name: p.name,
			displayName: p.display_name,
			description: p.description,
			owner: {
				id: p.owner?.id || 'unknown',
				username: p.owner?.username || 'unknown',
				avatarUrl: p.owner?.avatar_url,
			},
			pricingType: p.pricing_type,
			totalDownloads: p.total_downloads,
			latestStableVersion: p.latest_stable_version,
			tags: p.tags,
			createdAt: p.created_at,
		};
	}

	private mapToPublicDetail(p: any): PublicPluginDetail {
		return {
			id: p.id,
			name: p.name,
			displayName: p.display_name,
			description: p.description,
			readme: p.readme,
			licenseType: p.license_type,
			homepageUrl: p.homepage_url,
			repoUrl: p.repo_url,
			documentationUrl: p.documentation_url,
			pricingType: p.pricing_type,
			totalDownloads: p.total_downloads,
			owner: {
				id: p.owner?.id || 'unknown',
				username: p.owner?.username || 'unknown',
				avatarUrl: p.owner?.avatar_url,
			},
			versions_count: p.versions_count,
			reviewsCount: p.reviews_count || 0,
			averageRating: p.average_rating || 0,
			tags: p.tags,
			createdAt: p.created_at,
			updatedAt: p.updated_at,
			latestStableVersion: p.latest_stable_version,
		};
	}

	private mapToPrivateListItem(p: any): PrivatePluginListItem {
		return {
			id: p.id,
			name: p.name,
			displayName: p.display_name,
			status: p.status,
			visibility: p.visibility,
			totalDownloads: p.total_downloads,
			latestStableVersion: p.latest_stable_version,
			createdAt: p.created_at,
			updatedAt: p.updated_at,
		};
	}

	// PUBLIC METHODS
	public async findPublicPlugins(filters: PublicPluginFilters): Promise<Result<PublicPluginListItem[], HttpError>> {
		const response = await httpClient.reqwest().get<any>('/plugins', {
			params: {
				page: filters.page,
				limit: filters.limit,
				search: filters.search,
				tags: filters.tags?.join(','),
				strategy: filters.strategy,
				sort_order: filters.sortOrder,
			},
		});

		return response.map((res) =>
			(res.data.data?.data || res.data.data?.items || []).map((p: any) => this.mapToPublicListItem(p)),
		);
	}

	public async getPluginDetail(slug: string): Promise<Result<PublicPluginDetail, HttpError>> {
		const response = await httpClient.reqwest().get<any>(`/plugins/${slug}`);
		return response.map((res) => this.mapToPublicDetail(res.data.data));
	}

	public async getPluginVersions(pluginId: string): Promise<Result<PluginVersion[], HttpError>> {
		const response = await httpClient.reqwest().get<any>(`/plugins/${pluginId}/versions`);
		return response.map((res) =>
			res.data.data.map((v: any) => ({
				id: v.id,
				changelog: v.changelog,
				status: v.status,
				publisheAt: new Date(v.published_at),
				downloadsCount: v.downloads_count,
				version: v.version,
			})),
		);
	}

	// PRIVATE METHODS (DEVELOPER)
	public async findDeveloperPlugins(
		filters: PrivatePluginFilters,
	): Promise<Result<PrivatePluginListItem[], HttpError>> {
		const response = await httpClient.reqwest().get<any>('/plugins/me', {
			params: {
				page: filters.page,
				limit: filters.limit,
				search: filters.search,
				status: filters.status,
			},
		});

		return response.map((res) => {
			return (res.data.data?.data || res.data.data?.items || []).map((p: any) => this.mapToPrivateListItem(p));
		});
	}

	public async yankPlugin(id: string): Promise<Result<void, HttpError>> {
		const response = await httpClient.reqwest().patch<void>(`/plugins/${id}/yank`);
		return response.map(() => {});
	}

	public async uploadPlugin(file: File): Promise<Result<PrivatePluginListItem, HttpError>> {
		const formData = new FormData();
		formData.append('access', 'public');
		formData.append('file', file);

		const response = await httpClient.reqwest().post<any>('/plugins/publish', formData);
		return response.map((res) => this.mapToPrivateListItem(res.data.data));
	}

	// COMPATIBILITY WITH EXISTING STORE
	public async findPluginsByStrategy(strategy?: FilterStrategy) {
		return this.findPublicPlugins({ strategy });
	}
	public async searchPlugins(query: string) {
		return this.findPublicPlugins({ search: query });
	}
	public async findPluginBySlug(slug: string) {
		return this.getPluginDetail(slug);
	}
}

export const pluginsService = new PluginsService();
export { FilterStrategy };
