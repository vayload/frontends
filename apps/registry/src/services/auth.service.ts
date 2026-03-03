import { httpClient, publicHttpClient } from '@/shared/httpClient';
import type { Result } from '@/common/rusty';
import type { HttpError } from '@/common/HttpClient';

export interface User {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
    role: 'admin' | 'developer' | 'moderator';
    plan?: 'free' | 'pro';
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

function base64UrlEncode(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function randomBytesBase64Url(length: number): string {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    return base64UrlEncode(bytes.buffer);
}

const generatePKCE = async () => {
    const state = randomBytesBase64Url(16);
    const codeVerifier = randomBytesBase64Url(64);

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);

    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = base64UrlEncode(digest);

    return {
        state,
        codeVerifier,
        codeChallenge,
    };
};

export type RegisterInput = {
    username: string;
    email: string;
    password: string;
};

class AuthService {
    private mapToUser(u: any): User {
        return {
            id: u.id,
            username: u.username,
            email: u.email,
            avatarUrl: u.avatar_url,
            role: u.role,
            plan: u.plan,
        };
    }

    /**
     * Logging with password and email
     */
    public async loginWithPassword(email: string, password: string): Promise<Result<AuthResponse, HttpError>> {
        const response = await publicHttpClient.reqwest().post<any>('/auth/login', { email, password });

        return response.map((res) => ({
            user: this.mapToUser(res.data.data.user),
            token: res.data.data.token,
        }));
    }

    /**
     * Logging with OAuth provider
     */
    public async loginWithOAuth(provider: string, origin: string): Promise<Result<{ url: string }, HttpError>> {
        const pkce = await generatePKCE();

        const response = await publicHttpClient.reqwest().post<any>(`/auth/oauth/${provider}`, {
            origin_uri: origin,
            state: pkce.state,
            code_challenge: pkce.codeChallenge,
            client_type: 'web',
        });

        return response.map((res) => ({
            url: res.data.data.authorization_uri,
        }));
    }

    public async register(input: RegisterInput): Promise<Result<AuthResponse, HttpError>> {
        const response = await publicHttpClient.reqwest().post<any>('/auth/register', {
            username: input.username,
            email: input.email,
            password: input.password,
        });

        return response.map((res) => ({
            user: this.mapToUser(res.data.data.user),
            token: res.data.data.token,
        }));
    }

    public async logout(): Promise<Result<void, HttpError>> {
        const response = await httpClient.reqwest().post<void>('/auth/logout');
        return response.map(() => {});
    }

    public async getSession(): Promise<Result<User, HttpError>> {
        const response = await httpClient.reqwest().get<any>('/auth/me');
        return response.map((res) => this.mapToUser(res.data.data));
    }

    public async refreshToken(): Promise<Result<void, HttpError>> {
        const response = await httpClient.reqwest().post<void>('/auth/refresh-token');
        return response.map(() => {});
    }

    public async verifyEmail(token: string): Promise<Result<void, HttpError>> {
        const response = await publicHttpClient.reqwest().get<void>(`/auth/verify-email?token=${token}`);
        return response.map(() => {});
    }

    public async resendVerification(email: string): Promise<Result<void, HttpError>> {
        const response = await publicHttpClient.reqwest().post<void>('/auth/resend-verification', { email });
        return response.map(() => {});
    }
}

export const authService = new AuthService();
