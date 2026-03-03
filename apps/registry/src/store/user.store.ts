import { create } from 'zustand';
import { usersService } from '@/services/users.service';
import type { UpdateProfileDto, PrivateUserProfile, ChangePasswordDto } from '@/models';

interface UserState {
    profile: PrivateUserProfile | null;
    stats: { pluginsCount: number; totalDownloads: number; reputation: number } | null;
    isLoading: boolean;
    error: string | null;
}

interface UserActions {
    fetchProfile: (id: string) => Promise<void>;
    updateProfile: (id: string, dto: UpdateProfileDto) => Promise<void>;
    changePassword: (dto: ChangePasswordDto) => Promise<void>;
    fetchStats: (id: string) => Promise<void>;
    clearError: () => void;
}

export const useUserStore = create<UserState & UserActions>((set) => ({
    profile: null,
    stats: null,
    isLoading: false,
    error: null,

    fetchProfile: async (id: string) => {
        set({ isLoading: true, error: null });
        const result = await usersService.getProfile(id);

        result.match({
            ok: (profile) => set({ profile, isLoading: false }),
            err: (error) => set({ error: error.message || 'Failed to fetch profile', isLoading: false }),
        });
    },

    updateProfile: async (id: string, dto: UpdateProfileDto) => {
        set({ isLoading: true, error: null });
        const result = await usersService.updateProfile(id, dto);

        result.match({
            ok: (profile) => set({ profile, isLoading: false }),
            err: (error) => set({ error: error.message || 'Failed to update profile', isLoading: false }),
        });
    },

    changePassword: async (dto: ChangePasswordDto) => {
        set({ isLoading: true, error: null });
        const result = await usersService.changePassword(dto);

        result.match({
            ok: () => set({ isLoading: false }),
            err: (error) => set({ error: error.message || 'Failed to change password', isLoading: false }),
        });
    },

    fetchStats: async (id: string) => {
        const result = await usersService.getUserStats(id);

        result.match({
            ok: (stats) => set({ stats }),
            err: (error) => console.error('Failed to fetch user stats', error),
        });
    },

    clearError: () => set({ error: null }),
}));
