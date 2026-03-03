import { useState, useEffect, useCallback } from 'react';
import { authService, type User } from '@/services/auth.service';
import { CookieKey, getCookie } from '@/shared/httpClient';
import { toast } from 'sonner';
import { navigate } from 'astro:transitions/client';

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isVerificationPending: boolean;
    registeredEmail: string | null;
}

export interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    loginWithOAuth: (provider: 'github' | 'google') => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    resendVerification: (email: string) => Promise<void>;
    verifyEmail: (token: string) => Promise<void>;
}

export const AUTH_EVENTS = {
    AUTH_SUCCESS: 'auth:success',
    AUTH_ERROR: 'auth:error',
    AUTH_LOGOUT: 'auth:logout',
    AUTH_LOADING: 'auth:loading',
} as const;

export const useAuth = (): AuthState & AuthActions => {
    const [authState, setAuthState] = useState<AuthState>({
        user: { id: 'sss', email: '', username: '' } as any,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        isVerificationPending: false,
        registeredEmail: null,
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
                    isVerificationPending: false,
                    registeredEmail: null,
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
                        isVerificationPending: false,
                        registeredEmail: null,
                    });
                },
                err: (error) => {
                    console.error('Error checking auth status:', error);
                    setAuthState((prev) => ({
                        ...prev,
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        isVerificationPending: false,
                        registeredEmail: null,
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
                isVerificationPending: false,
                registeredEmail: null,
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
                    isVerificationPending: false,
                    registeredEmail: null,
                });
                toast.success('Login successful');
                navigate('/dev');
            },
            err: (error) => {
                console.log(error);
                const errorMessage =
                    error.response?.data?.error?.message || error.message || 'Error details not provided';
                setAuthState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));
                toast.error(errorMessage);
            },
        });
    }, []);

    const register = useCallback(async (username: string, email: string, password: string) => {
        setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

        const result = await authService.register({ username, email, password });

        result.match({
            ok: () => {
                setAuthState((prev) => ({
                    ...prev,
                    isLoading: false,
                    isVerificationPending: true,
                    registeredEmail: email,
                    error: null,
                }));
                toast.success('Registration successful! Please check your email to verify your account.');
            },
            err: (error) => {
                const errorMessage = error.response?.data?.error?.message || error.message || 'Registration failed';
                setAuthState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));
                toast.error(errorMessage);
            },
        });
    }, []);

    const resendVerification = useCallback(async (email: string) => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        const result = await authService.resendVerification(email);

        result.match({
            ok: () => {
                setAuthState((prev) => ({ ...prev, isLoading: false }));
                toast.success('Verification email resent. Please check your inbox.');
            },
            err: (error) => {
                const errorMessage = error.response?.data?.error?.message || error.message || 'Failed to resend email';
                setAuthState((prev) => ({ ...prev, isLoading: false }));
                toast.error(errorMessage);
            },
        });
    }, []);

    const verifyEmail = useCallback(async (token: string) => {
        setAuthState((prev) => ({ ...prev, isLoading: true }));
        const result = await authService.verifyEmail(token);

        result.match({
            ok: () => {
                toast.success('Email verified correctly');
                // We'll need to fetch the session or redirect to login
                // For now, let's redirect to dashboard if the cookie is set, or login
                const isLogged = getCookie(CookieKey.IS_LOGGED);
                if (isLogged) {
                    navigate('/dev');
                } else {
                    window.location.href = '/auth';
                }
            },
            err: (error) => {
                const errorMessage = error.response?.data?.error?.message || error.message || 'Verification failed';
                setAuthState((prev) => ({ ...prev, isLoading: false }));
                toast.error(errorMessage);
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
                const errorMessage =
                    error.response?.data?.error?.message || error.message || `Error al autenticar con ${provider}`;
                setAuthState((prev) => ({
                    ...prev,
                    isLoading: false,
                    error: errorMessage,
                }));
                toast.error(errorMessage);
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
                    isVerificationPending: false,
                    registeredEmail: null,
                });
                window.location.href = '/';
            },
            err: (error) => {
                console.error('Logout error:', error);
                toast.error('Logout failed');
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
        resendVerification,
        verifyEmail,
    };
};
