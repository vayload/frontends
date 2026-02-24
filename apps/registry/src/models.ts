export interface PaginatedResult<T> {
	data: T[];
	page: number;
	limit: number;
	total: number;
	totalPages: number;
}

// PLUGINS (PUBLIC)
export enum FilterStrategy {
	SCORE = 'score',
	LATEST = 'latest',
	FREE = 'free',
	PAID = 'paid',
}

export interface PublicPluginFilters {
	page?: number;
	limit?: number;
	search?: string;
	tags?: string[];
	strategy?: FilterStrategy;
	sortOrder?: 'asc' | 'desc';
}

export interface PublicPluginListItem {
	id: string;
	name: string;
	displayName: string;
	description?: string;
	owner: {
		id: string;
		username: string;
		avatarUrl?: string;
	};
	pricingType: 'free' | 'paid' | 'subscription';
	totalDownloads: number;
	latestStableVersion?: string;
	tags: string[];
	createdAt: string;
}

export interface PublicPluginDetail {
	id: string;
	name: string;
	displayName: string;
	description?: string;
	readme?: string;
	license?: string;
	licenseType?: string;
	homepageUrl?: string;
	repoUrl?: string;
	documentationUrl?: string;

	pricingType: 'free' | 'paid' | 'subscription';
	totalDownloads: number;

	owner: {
		id: string;
		username: string;
		avatarUrl?: string;
	};
	latestStableVersion: string;

	// versions: {
	// 	version: string;
	// 	status: 'stable' | 'beta';
	// 	publishedAt: string;
	// 	downloadsCount: number;
	// }[];
	versions_count: number;

	averageRating?: number;
	reviewsCount: number;

	tags: string[];
	createdAt: string;
	updatedAt: string;
}

export interface PluginVersion {
	id: string;
	changelog?: string;
	status: 'beta' | 'stable';
	version: string;
	publisheAt: Date;
	downloadsCount: number;
}

// PLUGINS (PRIVATE)
export interface PrivatePluginFilters {
	page?: number;
	limit?: number;
	search?: string;
	status?: 'draft' | 'published' | 'deprecated' | 'archived' | 'yanked';
}

export interface PrivatePluginListItem {
	id: string;
	name: string;
	displayName: string;
	status: 'draft' | 'published' | 'deprecated' | 'archived';
	visibility: 'public' | 'private' | 'unlisted';
	totalDownloads: number;
	latestStableVersion?: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

// API tokens
export type ApiTokenScope = 'global' | 'plugin:read' | 'plugin:write' | 'plugin:publish' | 'stats:read';

export interface CreateApiTokenDto {
	name: string;
	description?: string;
	scope: ApiTokenScope[];
	expiresAt?: string;
	pluginId?: string; // null = global
}

export interface ApiToken {
	id: string;
	name: string;
	keyMask: string;
	scope: ApiTokenScope[];
	pluginId?: string;
	enabled: boolean;
	createdAt: string;
	lastUsedAt?: string;
	expiresAt?: string;
	revokedAt?: string;
	revokedReason?: string;
	key?: string; // Temporal real token
}

/// USERS
export interface PublicUserProfile {
	id: string;
	username: string;
	avatarUrl?: string;
	role: 'admin' | 'developer' | 'moderator';
	createdAt: string;
}

export interface PrivateUserProfile extends PublicUserProfile {
	email?: string;
	isActive: boolean;
	provider: 'password' | 'github' | 'google' | 'gitlab' | 'other';
	verifiedAt?: string | null;
	lastLoginAt?: string;
}

export interface UpdateProfileDto {
	username?: string;
	avatarUrl?: string;
}
