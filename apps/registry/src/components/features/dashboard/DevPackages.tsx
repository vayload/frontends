import { UploadCloud, Download, Settings, Trash2, Package } from 'lucide-react';
import { Button } from '../../atoms/Button';
import { Badge } from '../../atoms/Badge';
import { Card } from '../../atoms/Card';
import { Skeleton } from '../../ui/Skeleton';
import { usePluginsStore } from '@/store/plugin.store';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmModal } from '../../atoms/ConfirmModal';
import { UploadPluginModal } from './UploadPluginModal';
import { useShallow } from 'zustand/shallow';

const formatNumber = (num: number): string => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
};

export const DevPackages = () => {
    const { user } = useAuth();
    const { privatePlugins, isFetching, error, fetchPrivatePlugins, yankPlugin } = usePluginsStore(
        useShallow((state) => ({
            yankPlugin: state.yankPlugin,
            isFetching: state.isFetching,
            error: state.error,
            fetchPrivatePlugins: state.fetchPrivatePlugins,
            privatePlugins: state.privatePlugins,
        })),
    );

    const [yankConfirm, setYankConfirm] = useState<{ id: string; name: string } | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState({ open: false, pluginId: '' });

    useEffect(() => {
        if (user?.id) {
            fetchPrivatePlugins(user.id);
        }
    }, [user]);

    const handleYank = (id: string, name: string) => {
        setYankConfirm({ id, name });
    };

    const confirmYank = async () => {
        if (yankConfirm) {
            await yankPlugin(yankConfirm.id);
            setYankConfirm(null);
        }
    };

    if (error) {
        return (
            <div className="animate-in fade-in duration-500">
                <div className="border-b border-neutral-800 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-white">My Packages</h2>
                    <p className="text-neutral-500 text-sm mt-1">
                        Manage the plugins you have uploaded to the repository.
                    </p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center gap-3 text-red-500">
                    <Package size={20} />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            <div className="border-b border-neutral-800 pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-white">My Packages</h2>
                    <p className="text-neutral-500 text-sm mt-1">
                        Manage the plugins you have uploaded to the repository.
                    </p>
                </div>
                <Button
                    variant="secondary"
                    className="h-10 px-6"
                    onClick={() => setIsUploadModalOpen({ open: true, pluginId: '' })}
                >
                    <UploadCloud size={18} className="mr-2" /> Upload Plugin
                </Button>
            </div>

            <div className="space-y-4">
                {isFetching && privatePlugins.length === 0 ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-6 bg-neutral-900/50 border border-neutral-800 rounded-2xl animate-pulse"
                        >
                            <div className="space-y-3">
                                <div className="h-5 w-48 bg-neutral-800 rounded" />
                                <div className="h-4 w-32 bg-neutral-800 rounded" />
                            </div>
                            <div className="h-10 w-24 bg-neutral-800 rounded" />
                        </div>
                    ))
                ) : privatePlugins.length === 0 ? (
                    <Card className="border-dashed border-neutral-800 bg-neutral-950/20 py-20">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600">
                                <Package size={32} />
                            </div>
                            <h3 className="text-neutral-200 font-semibold text-lg mb-2">No packages yet</h3>
                            <p className="text-neutral-500 text-sm mb-8 max-w-xs mx-auto">
                                You haven't uploaded any plugins yet. Share your code with the community.
                            </p>
                            <div className="w-full flex justify-center items-center">
                                <Button
                                    variant="primary"
                                    className="h-11 px-8"
                                    onClick={() => setIsUploadModalOpen({ open: true, pluginId: '' })}
                                >
                                    <UploadCloud size={18} className="mr-2" /> Upload Plugin
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    privatePlugins.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="group flex items-center justify-between p-6 bg-neutral-900/40 border border-neutral-800 rounded-2xl hover:border-orange-500/30 transition-all duration-300"
                        >
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-orange-500 group-hover:bg-neutral-900 transition-colors">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors">
                                            {pkg.displayName}
                                        </h3>
                                        <Badge
                                            variant={pkg.status === 'published' ? 'success' : 'neutral'}
                                            className="text-[10px] uppercase font-bold"
                                        >
                                            {pkg.status}
                                        </Badge>
                                        <Badge variant="outline" className="text-[10px] lowercase font-normal">
                                            {pkg.visibility}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-neutral-500 flex items-center gap-2">
                                        <span className="font-mono text-neutral-400">
                                            v{pkg.latestStableVersion || '0.0.1'}
                                        </span>
                                        <span>•</span>
                                        <span>Updated {formatDate(pkg.updatedAt)}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-sm font-bold text-neutral-300 flex items-center gap-1.5">
                                        <Download size={14} className="text-neutral-500" />{' '}
                                        {formatNumber(pkg.totalDownloads)}
                                    </span>
                                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                                        Downloads
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" className="h-9 w-9 p-0" title="Settings">
                                        <Settings size={16} />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-9 w-9 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                        title="Yank (Delete)"
                                        onClick={() => handleYank(pkg.id, pkg.name)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        className="h-9 text-xs px-4"
                                        onClick={() => setIsUploadModalOpen({ open: true, pluginId: pkg.id })}
                                    >
                                        Upload New Version
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConfirmModal
                isOpen={!!yankConfirm}
                onClose={() => setYankConfirm(null)}
                onConfirm={confirmYank}
                variant="danger"
                title="Yank Plugin?"
                message={
                    <>
                        Are you sure you want to yank{' '}
                        <span className="text-white font-bold">"{yankConfirm?.name}"</span>? This will hide it from
                        search results and mark it as yanked. Users who already have it installed will still be able to
                        use it.
                    </>
                }
                confirmText="Yank Plugin"
                isLoading={isFetching}
            />

            <UploadPluginModal
                isOpen={isUploadModalOpen.open}
                onClose={() => setIsUploadModalOpen({ open: false, pluginId: '' })}
                pluginId={isUploadModalOpen.pluginId}
            />
        </div>
    );
};
