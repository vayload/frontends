import { useEffect, useState } from 'react';
import { Key, Trash2, Plus, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '../../atoms/Card';
import { Button } from '../../atoms/Button';
import { DataTable } from '../../atoms/DataTable';
import { Badge } from '../../atoms/Badge';
import { SkeletonCard, SkeletonTableRow } from '../../ui/Skeleton';
import { CreateTokenModal } from './CreateTokenModal';
import { TokenCreatedModal } from './TokenCreatedModal';
import { ConfirmModal } from '../../atoms/ConfirmModal';
import { useApiTokenStore } from '@/store/api-token.store';
import { useAuth } from '@/hooks/useAuth';
import { useShallow } from 'zustand/shallow';
import { formatDate } from '@/shared/format.utils';
import type { ApiToken } from '@/services/api-token.service';

export const DevTokens = () => {
	const { user } = useAuth();
	const { tokens, isLoading, error, fetchTokens, createToken, revokeToken, deleteToken } = useApiTokenStore(
		useShallow((state) => ({
			tokens: state.tokens,
			isLoading: state.isLoading,
			error: state.error,
			fetchTokens: state.fetchTokens,
			createToken: state.createToken,
			revokeToken: state.revokeToken,
			deleteToken: state.deleteToken,
		})),
	);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isCreatedModalOpen, setIsCreatedModalOpen] = useState(false);
	const [newTokenData, setNewTokenData] = useState<{ name: string; value: string } | null>(null);
	const [revokeConfirmId, setRevokeConfirmId] = useState<string | null>(null);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

	useEffect(() => {
		if (user?.id) {
			fetchTokens();
		}
	}, [user]);

	const handleCreateToken = async (data: any) => {
		if (!user?.id) return;

		const result = await createToken({
			name: data.name,
			description: data.description,
			scope: data.scope,
			pluginId: data.pluginId,
			expiresAt: data.expires_at,
		});

		result.match({
			ok: (token: ApiToken) => {
				setNewTokenData({ name: data.name, value: token.key || '' });
				setIsCreatedModalOpen(true);
				setIsCreateModalOpen(false);
			},
			err: (message) => {
				console.log({ message });
			},
		});
	};

	const handleRevokeClick = (tokenId: string) => {
		setRevokeConfirmId(tokenId);
	};

	const confirmRevoke = async () => {
		if (revokeConfirmId) {
			try {
				await revokeToken(revokeConfirmId, 'User revoked token via dashboard');
			} catch (err) {
				console.error('Failed to revoke token:', err);
			}
			setRevokeConfirmId(null);
		}
	};

	const handleDeleteClick = (tokenId: string) => {
		setDeleteConfirmId(tokenId);
	};

	const confirmDelete = async () => {
		if (deleteConfirmId) {
			try {
				await deleteToken(deleteConfirmId);
			} catch (err) {
				console.error('Failed to delete token:', err);
			}
			setDeleteConfirmId(null);
		}
	};

	const formatDateInternal = (dateString: string | null | undefined) => {
		return formatDate(dateString);
	};

	const getStatusBadge = (token: ApiToken) => {
		if (token.revokedAt) {
			return <Badge variant="error">Revoked</Badge>;
		}

		const isExpired = token.expiresAt && new Date(token.expiresAt).getTime() < new Date().getTime();
		if (isExpired) {
			return <Badge variant="warning">Expired</Badge>;
		}
		return <Badge variant="success">Active</Badge>;
	};

	const apiKeyColumns = [
		{ key: 'name', label: 'Name' },
		{ key: 'keyMask', label: 'Token' },
		{ key: 'scope', label: 'Scope' },
		{ key: 'createdAt', label: 'Created' },
		{ key: 'status', label: 'Status' },
		{
			key: 'actions',
			label: 'Actions',
		},
	];

	const getScopeDisplay = (scopes: string[]) => {
		if (scopes.includes('global')) return 'Global';
		const cleanScopes = scopes.map((s) => s.replace('plugin:', ''));
		if (cleanScopes.length <= 2) return cleanScopes.join(', ');
		return `${cleanScopes[0]} +${cleanScopes.length - 1} more`;
	};

	const tableData = tokens.map((token) => ({
		name: (
			<div>
				<p className="text-white font-medium">{token.name}</p>
				{token.pluginId && (
					<p className="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
						Scoped: {token.pluginId}
					</p>
				)}
			</div>
		),
		keyMask: <code className="text-neutral-400 text-sm">{token.keyMask}</code>,
		scope: (
			<span className="text-neutral-400 text-sm truncate max-w-[150px] inline-block">
				{getScopeDisplay(token.scope)}
			</span>
		),
		createdAt: <span className="text-neutral-400 text-sm">{formatDateInternal(token.createdAt)}</span>,
		status: getStatusBadge(token),
		actions: (
			<div className="flex items-center gap-1">
				{token.revokedAt ? (
					<Button
						variant="ghost"
						onClick={() => handleDeleteClick(token.id)}
						className="text-red-400 hover:text-red-300"
					>
						<Trash2 size={16} />
					</Button>
				) : (
					<Button
						variant="ghost"
						onClick={() => handleRevokeClick(token.id)}
						className="text-orange-400 hover:text-orange-300"
						title="Revoke token"
					>
						<XCircle size={16} />
					</Button>
				)}
			</div>
		),
	}));

	if (isLoading && tokens.length === 0) {
		return (
			<div className="animate-in fade-in duration-500 space-y-6">
				<div className="border-b border-neutral-800 pb-4">
					<div className="h-8 w-48 bg-neutral-800 rounded mb-2 animate-pulse" />
					<div className="h-4 w-72 bg-neutral-800 rounded animate-pulse" />
				</div>
				<SkeletonCard />
				<Card className="bg-neutral-950/40 border-neutral-800">
					<div className="p-4">
						<SkeletonTableRow columns={6} isTable={false} />
						<SkeletonTableRow columns={6} isTable={false} />
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div className="animate-in fade-in duration-500 space-y-6">
			<div className="pb-4 flex justify-between items-end">
				<div>
					<h2 className="text-2xl font-bold text-white">API Tokens</h2>
					<p className="text-neutral-500 text-sm mt-1">
						Manage tokens to access the Vayload API from the terminal or CI/CD.
					</p>
				</div>
				<Button variant="secondary" onClick={() => setIsCreateModalOpen(true)}>
					<Plus size={18} />
					Generate Token
				</Button>
			</div>

			{error && (
				<div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-center gap-3">
					<AlertTriangle size={20} className="text-red-400" />
					<p className="text-red-400 text-sm">{error}</p>
				</div>
			)}

			{tokens.length > 0 ? (
				<Card className="bg-neutral-950/40 border-neutral-800 overflow-hidden">
					<DataTable columns={apiKeyColumns} data={tableData} />
				</Card>
			) : (
				!isLoading && (
					<Card className="bg-neutral-950/40 border-neutral-800 border-dashed">
						<div className="p-12 text-center">
							<div className="w-16 h-16 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-800">
								<Key size={32} className="text-neutral-600" />
							</div>
							<h3 className="text-neutral-200 font-semibold text-lg mb-2">No API Tokens Found</h3>
							<p className="text-neutral-500 text-sm max-w-sm mx-auto mb-8">
								Generate your first token to start interacting with the Vayload registry through our
								CLI.
							</p>
							<div className="flex justify-center items-center w-full">
								<Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
									<Plus size={18} />
									Generate Token
								</Button>
							</div>
						</div>
					</Card>
				)
			)}

			<CreateTokenModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={handleCreateToken}
				isLoading={isLoading}
			/>

			{newTokenData && (
				<TokenCreatedModal
					isOpen={isCreatedModalOpen}
					tokenName={newTokenData.name}
					tokenValue={newTokenData.value}
					onClose={() => {
						setIsCreatedModalOpen(false);
						setNewTokenData(null);
					}}
				/>
			)}

			<ConfirmModal
				isOpen={!!revokeConfirmId}
				onClose={() => setRevokeConfirmId(null)}
				onConfirm={confirmRevoke}
				title="Revoke Token?"
				message="Any applications or CI/CD pipelines using this token will immediately lose access. This action cannot be undone."
				confirmText="Revoke Token"
				isLoading={isLoading}
			/>

			<ConfirmModal
				isOpen={!!deleteConfirmId}
				onClose={() => setDeleteConfirmId(null)}
				onConfirm={confirmDelete}
				variant="danger"
				title="Delete Token?"
				message="This token and its history will be permanently deleted. Any systems still using it will fail to authenticate."
				confirmText="Delete Permanently"
				isLoading={isLoading}
			/>
		</div>
	);
};
