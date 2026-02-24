import { useAuth } from '../../../hooks/useAuth';
import { Card } from '../../atoms/Card';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { User as UserIcon, Mail, Shield, Key, Download, Package, Activity, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/user.store';
import { formatDate, formatDateTime } from '@/shared/format.utils';

export const DevProfile = () => {
	const { user, isAuthenticated } = useAuth();
	const { profile, stats, fetchProfile, fetchStats, isLoading } = useUserStore();
	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (user?.id) {
			fetchProfile(user.id);
			fetchStats(user.id);
		}
	}, [user]);

	if (isLoading || !profile) {
		return <div className="p-10 text-center text-neutral-500">Loading profile...</div>;
	}

	return (
		<div className="space-y-6">
			<div className="border-b border-neutral-800 pb-4 flex justify-between items-end">
				<div>
					<h2 className="text-2xl font-bold text-white">Developer Profile</h2>
					<p className="text-neutral-500 text-sm mt-1">
						Manage your public presence and view account status.
					</p>
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
						<button className="absolute -bottom-2 -right-2 bg-neutral-800 border border-neutral-700 rounded-lg p-1.5 text-neutral-400 hover:text-white transition-colors shadow-xl">
							<Activity size={14} />
						</button>
					</div>

					<div className="flex-1 text-center md:text-left">
						<div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
							<h3 className="text-2xl font-bold text-white">{profile.username}</h3>
							<Badge variant="neutral" className="w-fit mx-auto md:mx-0">
								{profile.provider}
							</Badge>
						</div>
						<p className="text-neutral-400 text-sm mb-6 max-w-lg">
							Full-stack developer passionate about building Vayload CMS plugins.
						</p>

						<div className="flex flex-wrap justify-center md:justify-start gap-6">
							<div className="flex items-center gap-2 text-sm text-neutral-500">
								<Mail size={16} />
								{profile.email}
							</div>
							<div className="flex items-center gap-2 text-sm text-neutral-500">
								<Shield size={16} className="text-green-500" />
								{profile.verifiedAt ? 'Verified Account' : 'Pending Verification'}
							</div>
						</div>
					</div>

					<div className="flex gap-2">
						<Button variant="outline" className="h-10 px-6">
							Edit Profile
						</Button>
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

			<Card className="bg-neutral-950/40 border-neutral-800 p-6">
				<div className="flex items-center gap-3 mb-6">
					<Key size={18} className="text-orange-500" />
					<h4 className="text-lg font-semibold text-white">Login Details</h4>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="space-y-4">
						<div className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-3">
							<span className="text-neutral-500">Account status</span>
							<span className="text-green-500 font-medium">Active</span>
						</div>
						<div className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-3">
							<span className="text-neutral-500">Member since</span>
							<span className="text-neutral-300">{formatDate(profile.createdAt)}</span>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-3">
							<span className="text-neutral-500">Last login</span>
							<span className="text-neutral-300">
								{profile.lastLoginAt ? formatDateTime(profile.lastLoginAt) : 'Never'}
							</span>
						</div>
						<div className="flex justify-between items-center text-sm border-b border-neutral-800/50 pb-3">
							<span className="text-neutral-500">Authentication</span>
							<span className="text-neutral-300 capitalize">{profile.provider}</span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
};
