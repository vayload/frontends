import { useState, useEffect, useCallback } from 'react';
import { type User, authService } from '@/services/auth.service';
// @ts-ignore
import { navigate } from 'astro:transitions/client';
import { CookieKey, getCookie } from '@/shared/httpClient';

export interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

export interface AuthActions {
	login: (email: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	loginWithOAuth: (provider: 'github' | 'google') => Promise<void>;
	logout: () => Promise<void>;
	clearError: () => void;
}

export const AUTH_EVENTS = {
	AUTH_SUCCESS: 'auth:success',
	AUTH_ERROR: 'auth:error',
	AUTH_LOGOUT: 'auth:logout',
	AUTH_LOADING: 'auth:loading',
} as const;

export const useAuth = (): AuthState & AuthActions => {
	const [authState, setAuthState] = useState<AuthState>({
		user: { id: 'user_1' } as any,
		isAuthenticated: false,
		isLoading: false,
		error: null,
	});

	const checkAuthStatus = useCallback(async () => {
		try {
			const isLogged = getCookie(CookieKey.IS_LOGGED);
			if (!isLogged) {
				setAuthState((prev) => ({
					...prev,
					user: null,
					isAuthenticated: false,
					isLoading: false,
				}));
				return;
			}

			const result = await authService.getSession();
			result.match({
				ok: (user) => {
					setAuthState({
						user,
						isAuthenticated: true,
						isLoading: false,
						error: null,
					});
					navigate('/dev');
				},
				err: (error) => {
					console.error('Error checking auth status:', error);
					setAuthState((prev) => ({
						...prev,
						user: null,
						isAuthenticated: false,
						isLoading: false,
					}));
				},
			});
		} catch (error) {
			console.error('Error checking auth status:', error);
			setAuthState((prev) => ({
				...prev,
				user: null,
				isAuthenticated: false,
				isLoading: false,
			}));
		}
	}, []);

	const login = useCallback(async (email: string, password: string) => {
		setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

		const result = await authService.loginWithPassword(email, password);

		result.match({
			ok: (response) => {
				setAuthState({
					user: response.user,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				});
				navigate('/dev');
			},
			err: (error) => {
				const errorMessage = error.message || 'Error al iniciar sesión';
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));
			},
		});
	}, []);

	const register = useCallback(async (username: string, email: string, password: string) => {
		setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

		const result = await authService.register({ username, email, password });

		result.match({
			ok: (response) => {
				setAuthState({
					user: response.user,
					isAuthenticated: true,
					isLoading: false,
					error: null,
				});
			},
			err: (error) => {
				const errorMessage = error.message || 'Error al registrarse';
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));
			},
		});
	}, []);

	const loginWithOAuth = useCallback(async (provider: 'github' | 'google') => {
		setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

		const result = await authService.loginWithOAuth(provider, window.location.origin + '/dev');

		result.match({
			ok: (response) => {
				window.location.replace(response.url);
			},
			err: (error) => {
				const errorMessage = error.message || `Error al autenticar con ${provider}`;
				setAuthState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
				}));
			},
		});
	}, []);

	const logout = useCallback(async () => {
		const result = await authService.logout();
		result.match({
			ok: () => {
				setAuthState({
					user: null,
					isAuthenticated: false,
					isLoading: false,
					error: null,
				});
				navigate('/');
			},
			err: (error) => {
				console.error('Logout error:', error);
			},
		});
	}, []);

	const clearError = useCallback(() => {
		setAuthState((prev) => ({ ...prev, error: null }));
	}, []);

	return {
		...authState,
		login,
		register,
		loginWithOAuth,
		logout,
		clearError,
		// refreshUser,
	};
};
