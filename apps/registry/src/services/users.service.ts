import { httpClient } from '@/shared/httpClient';
import type { PrivateUserProfile, UpdateProfileDto, ChangePasswordDto } from '../models';
import type { Result } from '@/common/rusty';
import type { HttpError } from '@/common/HttpClient';

class UsersService {
    private mapToCamelCase(user: any): PrivateUserProfile {
        return {
            id: user.id,
            username: user.username,
            avatarUrl: user.avatar_url,
            role: user.role,
            createdAt: user.created_at,
            email: user.email,
            isActive: user.is_active,
            provider: user.provider,
            verifiedAt: user.verified_at,
            lastLoginAt: user.last_login_at,
        };
    }

    public async getProfile(id: string): Promise<Result<PrivateUserProfile, HttpError>> {
        const response = await httpClient.reqwest().get<any>(`/auth/me`);
        return response.map((res) => this.mapToCamelCase(res.data.data));
    }

    public async updateProfile(id: string, dto: UpdateProfileDto): Promise<Result<PrivateUserProfile, HttpError>> {
        const response = await httpClient.reqwest().patch<any>(`/users/${id}`, dto);
        return response.map((res) => this.mapToCamelCase(res.data.data));
    }

    public async changePassword(dto: ChangePasswordDto): Promise<Result<void, HttpError>> {
        const response = await httpClient.reqwest().post<void>(`/auth/change-password`, dto);
        return response.map(() => {});
    }

    public async getUserStats(
        id: string,
    ): Promise<Result<{ pluginsCount: number; totalDownloads: number; reputation: number }, HttpError>> {
        const response = await httpClient.reqwest().get<any>(`/auth/me/stats`);
        return response.map((res) => ({
            pluginsCount: res.data.data.total_plugins,
            totalDownloads: res.data.data.total_downloads,
            reputation: res.data.data.reputation,
        }));
    }
}

export const usersService = new UsersService();
