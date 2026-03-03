import type { CreateApiTokenDto, ApiTokenScope } from '../models';
import { httpClient } from '@/shared/httpClient';

export class ApiToken {
    public readonly id: string;
    public readonly name: string;
    public readonly keyMask: string;
    public readonly scope: ApiTokenScope;
    public readonly pluginId: string;
    public readonly enabled: boolean;
    public readonly createdAt: string;
    public readonly lastUsedAt: string;
    public readonly expiresAt: string;
    public readonly revokedAt: string;
    public readonly revokedReason: string;
    public readonly key: string;

    public constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.keyMask = data.key_mask;
        this.scope = data.scope;
        this.pluginId = data.plugin_id;
        this.enabled = data.enabled;
        this.createdAt = data.created_at;
        this.lastUsedAt = data.last_used_at;
        this.expiresAt = data.expires_at;
        this.revokedAt = data.revoked_at;
        this.revokedReason = data.revoked_reason;
        this.key = data.key;
    }

    public static fromJSON(data: any): ApiToken {
        return new ApiToken(data);
    }
}

class ApiTokensService {
    public async getAll() {
        const response = await httpClient.reqwest().get('/auth/me/api-tokens');

        return response.map<ApiToken[]>((a) => a.data.data.map(ApiToken.fromJSON));
    }

    public async create(body: CreateApiTokenDto) {
        const response = await httpClient.reqwest().post('/auth/me/api-tokens', body);

        return response.map<ApiToken>((a) => ApiToken.fromJSON(a.data.data));
    }

    public async revoke(id: string, reason?: string) {
        const response = await httpClient.reqwest().patch(`/auth/me/api-tokens/${id}/revoke`, { reason });

        return response.map<string>((a) => String(a.data.data?.id));
    }

    public async delete(id: string) {
        const response = await httpClient.reqwest().delete(`/auth/me/api-tokens/${id}`);

        return response.map<void>((a) => void 0);
    }
}

export const apiTokensService = new ApiTokensService();
