import { useAuth } from '../../../hooks/useAuth';
import { Card } from '../../atoms/Card';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { Input } from '../../atoms/Input';
import { Label } from '../../atoms/Label';
import {
    User as UserIcon,
    Mail,
    Shield,
    Key,
    Lock,
    Download,
    Package,
    Activity,
    Star,
    Eye,
    EyeOff,
    Check,
    X,
    AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user.store';
import { formatDate, formatDateTime } from '@/shared/format.utils';
import { toast } from 'sonner';

const ProviderIcon = ({ provider, size = 16 }: { provider: string; size?: number }) => {
    switch (provider) {
        case 'github':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            );
        case 'google':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
            );
        case 'gitlab':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24">
                    <path
                        d="M23.955 13.587l-1.342-4.135-2.664-8.189c-.135-.417-.724-.417-.859 0L16.425 9.452H7.575L4.91 1.263c-.135-.417-.724-.417-.859 0L1.387 9.452.045 13.587c-.114.352.016.741.327.967l11.628 8.449 11.628-8.449c.311-.226.441-.615.327-.967"
                        fill="#E24329"
                    />
                </svg>
            );
        default:
            return <Lock size={size} />;
    }
};

export const DevProfile = () => {
    const { user } = useAuth();
    const { profile, stats, fetchProfile, fetchStats, updateProfile, changePassword, isLoading, error } =
        useUserStore();

    // Username editing state
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');

    // Password changing state
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetchProfile(user.id);
            fetchStats(user.id);
        }
    }, [user]);

    useEffect(() => {
        if (profile) {
            setNewUsername(profile.username);
        }
    }, [profile]);

    const handleUpdateUsername = async () => {
        if (!profile || newUsername === profile.username) {
            setIsEditingUsername(false);
            return;
        }

        if (newUsername.length < 3) {
            toast.error('Username must be at least 3 characters long');
            return;
        }

        try {
            await updateProfile(profile.id, { username: newUsername });
            setIsEditingUsername(false);
            toast.success('Username updated successfully');
        } catch (err) {
            toast.error('Failed to update username');
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters long');
            return;
        }

        try {
            await changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('Password changed successfully');
        } catch (err) {
            toast.error('Failed to change password');
        }
    };

    if (isLoading && !profile) {
        return <div className="p-10 text-center text-neutral-500">Loading profile...</div>;
    }

    if (!profile) return null;

    const isPasswordProvider = profile.provider === 'password';

    return (
        <div className="space-y-6">
            <div className="border-b border-neutral-800 pb-4 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white">Developer Profile</h2>
                    <p className="text-neutral-500 text-sm mt-1">Manage your account settings and preferences.</p>
                </div>
                <Badge variant="outline" className="mb-1">
                    {profile.role?.toUpperCase()}
                </Badge>
            </div>

            <Card className="bg-neutral-950/40 border-neutral-800 p-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 overflow-hidden group-hover:border-orange-500/50 transition-colors">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.username}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <UserIcon size={32} />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2 justify-center md:justify-start">
                            {isEditingUsername ? (
                                <div className="flex items-center gap-2">
                                    <Input
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="h-9 w-48 text-lg font-bold"
                                        autoFocus
                                    />
                                    <button
                                        onClick={handleUpdateUsername}
                                        className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditingUsername(false);
                                            setNewUsername(profile.username);
                                        }}
                                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-white">{profile.username}</h3>
                                    <button
                                        onClick={() => setIsEditingUsername(true)}
                                        className="text-xs text-neutral-500 hover:text-orange-500 transition-colors underline underline-offset-4"
                                    >
                                        Change username
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4">
                            <div className="flex items-center gap-2 text-sm text-neutral-300">
                                <Mail size={16} className="text-neutral-500" />
                                {profile.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <ProviderIcon provider={profile.provider} />
                                <span className="text-neutral-300 capitalize">{profile.provider}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Shield
                                    size={16}
                                    className={profile.verifiedAt ? 'text-green-500' : 'text-orange-500'}
                                />
                                <span className={profile.verifiedAt ? 'text-green-500' : 'text-orange-500'}>
                                    {profile.verifiedAt ? 'Verified Account' : 'Pending Verification'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-neutral-950/40 border-neutral-800 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                        <Package size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 font-medium">Plugins</p>
                        <p className="text-2xl font-bold text-white">{stats?.pluginsCount || 0}</p>
                    </div>
                </Card>

                <Card className="bg-neutral-950/40 border-neutral-800 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <Download size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 font-medium">Downloads</p>
                        <p className="text-2xl font-bold text-white">{stats?.totalDownloads || 0}</p>
                    </div>
                </Card>

                <Card className="bg-neutral-950/40 border-neutral-800 p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                        <Star size={22} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-500 font-medium">Reputation</p>
                        <p className="text-2xl font-bold text-white">{stats?.reputation || 0}</p>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-neutral-950/40 border-neutral-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Activity size={18} className="text-orange-500" />
                        <h4 className="text-lg font-semibold text-white">Account Details</h4>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-3">
                            <span className="text-neutral-500">Account status</span>
                            <span className="text-green-500 font-medium">Active</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-3">
                            <span className="text-neutral-500">Member since</span>
                            <span className="text-neutral-300">{formatDate(profile.createdAt)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-3">
                            <span className="text-neutral-500">Last login</span>
                            <span className="text-neutral-300">
                                {profile.lastLoginAt ? formatDateTime(profile.lastLoginAt) : 'Never'}
                            </span>
                        </div>
                    </div>
                </Card>

                <Card className="bg-neutral-950/40 border-neutral-800 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Key size={18} className="text-orange-500" />
                        <h4 className="text-lg font-semibold text-white">Security & Auth</h4>
                    </div>

                    {!isPasswordProvider ? (
                        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex gap-3">
                            <AlertCircle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                            <div className="text-sm">
                                <p className="text-white font-medium mb-1 capitalize">Managed by {profile.provider}</p>
                                <p className="text-neutral-400">
                                    Your account uses external authentication. Manage your password directly from your
                                    provider.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {!isChangingPassword ? (
                                <div className="flex flex-col gap-4">
                                    <p className="text-sm text-neutral-400">
                                        Keep your account secure by periodically updating your password.
                                    </p>
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() => setIsChangingPassword(true)}
                                    >
                                        Change Password
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-neutral-500">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPasswords ? 'text' : 'password'}
                                                value={passwordData.currentPassword}
                                                onChange={(e) =>
                                                    setPasswordData((prev) => ({
                                                        ...prev,
                                                        currentPassword: e.target.value,
                                                    }))
                                                }
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-neutral-500">New Password</Label>
                                        <Input
                                            type={showPasswords ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) =>
                                                setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                                            }
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs text-neutral-500">Confirm New Password</Label>
                                        <Input
                                            type={showPasswords ? 'text' : 'password'}
                                            value={passwordData.confirmPassword}
                                            onChange={(e) =>
                                                setPasswordData((prev) => ({
                                                    ...prev,
                                                    confirmPassword: e.target.value,
                                                }))
                                            }
                                            placeholder="••••••••"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <button
                                            onClick={() => setShowPasswords(!showPasswords)}
                                            className="text-xs text-neutral-500 hover:text-white flex items-center gap-1.5 transition-colors"
                                        >
                                            {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                                            {showPasswords ? 'Hide passwords' : 'Show passwords'}
                                        </button>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            variant="primary"
                                            className="flex-1"
                                            onClick={handleChangePassword}
                                            isLoading={isLoading}
                                            disabled={
                                                !passwordData.currentPassword ||
                                                !passwordData.newPassword ||
                                                !passwordData.confirmPassword
                                            }
                                        >
                                            Update Password
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setIsChangingPassword(false)}
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
