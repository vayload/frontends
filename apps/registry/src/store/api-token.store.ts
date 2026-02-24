import { create } from 'zustand';
import { ApiToken, apiTokensService } from '@/services/api-token.service';
import type { CreateApiTokenDto } from '../models.ts';
import { err, ok, type Result } from '@/common/rusty.ts';

interface ApiTokenState {
	tokens: ApiToken[];
	isLoading: boolean;
	error: string | null;
}

interface ApiTokenActions {
	fetchTokens: () => Promise<void>;
	createToken: (dto: CreateApiTokenDto) => Promise<Result<ApiToken, string>>;
	revokeToken: (id: string, reason?: string) => Promise<void>;
	deleteToken: (id: string) => Promise<void>;
	clearError: () => void;
}

export const useApiTokenStore = create<ApiTokenState & ApiTokenActions>((set, get) => ({
	tokens: [],
	isLoading: false,
	error: null,

	fetchTokens: async () => {
		set({ isLoading: true, error: null });

		const result = await apiTokensService.getAll();
		result.match({
			ok: (tokens) => {
				set({ tokens, isLoading: false });
			},
			err: (error) => {
				set({ error: error.message, isLoading: false });
			},
		});
	},

	createToken: async (dto: CreateApiTokenDto): Promise<Result<ApiToken, string>> => {
		set({ isLoading: true, error: null });

		const result = await apiTokensService.create(dto);

		return result.match({
			ok: (token) => {
				set((state) => ({ tokens: [token, ...state.tokens], isLoading: false }));

				return ok(token);
			},
			err: (error) => {
				const message = error.response?.data?.error?.message || error.message;
				set({ error: message, isLoading: false });

				return err(message);
			},
		});
	},

	revokeToken: async (id: string, reason?: string) => {
		set({ isLoading: true, error: null });

		const result = await apiTokensService.revoke(id, reason);

		result.match({
			ok: () => {
				set((state) => ({
					tokens: state.tokens.map((t) => (t.id === id ? { ...t, revokedAt: new Date().toISOString() } : t)),
					isLoading: false,
				}));
			},
			err: (error) => {
				const message = error.response?.data?.error?.message || error.message;
				set({ error: message, isLoading: false });
			},
		});
	},

	deleteToken: async (id: string) => {
		set({ isLoading: true, error: null });

		const result = await apiTokensService.delete(id);

		result.match({
			ok: () => {
				set((state) => ({
					tokens: state.tokens.filter((t) => t.id !== id),
					isLoading: false,
				}));
			},
			err: (error) => {
				set({ error: error.message, isLoading: false });
			},
		});
	},

	clearError: () => set({ error: null }),
}));
