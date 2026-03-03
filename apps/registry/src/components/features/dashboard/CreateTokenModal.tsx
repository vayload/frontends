import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../atoms/Button';
import { Modal } from '../../atoms/Modal';
import { Input } from '../../atoms/Input';
import { Label } from '../../atoms/Label';
import { CustomSelect, type SelectOption } from '../../atoms/CustomSelect';
import { Globe, Package, Shield, Clock } from 'lucide-react';
import { pluginsService } from '@/services/plugins.service';
import { useAuth } from '@/hooks/useAuth';
import type { PrivatePluginListItem } from '@/models';

interface CreateTokenModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => Promise<void>; // Payload is mapped internally
    isLoading?: boolean;
}

export interface CreateTokenFormData {
    name: string;
    description: string;
    scopeTarget: string; // 'global' or plugin_id
    accessLevel: 'read' | 'write' | 'read-write';
    expiration: '40' | '90' | 'never';
}

export const CreateTokenModal = ({ isOpen, onClose, onSubmit, isLoading }: CreateTokenModalProps) => {
    const { user } = useAuth();
    const [userPlugins, setUserPlugins] = useState<PrivatePluginListItem[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<CreateTokenFormData>({
        defaultValues: {
            scopeTarget: 'global',
            accessLevel: 'read-write',
            expiration: '40',
        },
    });

    const selectedScopeTarget = watch('scopeTarget');
    const selectedAccessLevel = watch('accessLevel');
    const selectedExpiration = watch('expiration');

    useEffect(() => {
        if (isOpen && user?.id) {
            pluginsService.findDeveloperPlugins({}).then((result) => {
                result.match({
                    ok: (plugins) => setUserPlugins(plugins),
                    err: (error) => console.error('Failed to fetch developer plugins', error),
                });
            });
        }
    }, [isOpen, user?.id]);

    const onFormSubmit = async (data: CreateTokenFormData) => {
        const isGlobal = data.scopeTarget === 'global';

        // Map access level to scopes
        const scope = isGlobal ? 'global:read-write' : (`plugin:${data.accessLevel}` as any);

        // Calculate expiration date
        let expiresAt: string | undefined = undefined;
        if (data.expiration !== 'never') {
            const date = new Date();
            date.setDate(date.getDate() + parseInt(data.expiration));
            expiresAt = date.toISOString();
        }

        await onSubmit({
            name: data.name,
            description: data.description,
            scope,
            pluginId: isGlobal ? undefined : data.scopeTarget,
            expires_at: expiresAt,
        });

        handleClose();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const scopeOptions: SelectOption[] = [
        {
            value: 'global',
            label: 'Global Access',
            description: 'Full account access (read & write)',
            icon: <Globe size={18} />,
        },
        ...userPlugins.map((p) => ({
            value: p.id,
            label: p.displayName,
            description: `Specifically for ${p.name}`,
            icon: <Package size={18} />,
        })),
    ];

    const accessOptions: SelectOption[] = [
        {
            value: 'read-write',
            label: 'Read & Write',
            description: 'Full access to the selected scope',
            icon: <Shield size={18} />,
        },
        { value: 'read', label: 'Read Only', description: 'Cannot modify or publish', icon: <Shield size={18} /> },
        { value: 'write', label: 'Write Only', description: 'Publish and update only', icon: <Shield size={18} /> },
    ];

    const expirationOptions: SelectOption[] = [
        { value: '40', label: '40 Days', description: 'Recommended for development', icon: <Clock size={18} /> },
        { value: '90', label: '90 Days', description: 'For long-term automation', icon: <Clock size={18} /> },
        { value: 'never', label: 'Never', description: 'Use with extreme caution', icon: <Clock size={18} /> },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create New API Token"
            footer={
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="create-token-form"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={isLoading}
                    >
                        Create Token
                    </Button>
                </div>
            }
        >
            <form id="create-token-form" onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
                <div>
                    <Label className="mb-1.5 inline-block">
                        Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                        {...register('name', { required: 'Name is required' })}
                        type="text"
                        placeholder="e.g., CI/CD Pipeline"
                        error={errors.name?.message}
                    />
                </div>

                <div>
                    <Label className="mb-1.5 inline-block text-neutral-400">Description (Optional)</Label>
                    <Input {...register('description')} placeholder="e.g. For publishing from GitHub Actions" />
                </div>

                <div>
                    <Label className="mb-1.5 inline-block text-neutral-400">Scope</Label>
                    <CustomSelect
                        options={scopeOptions}
                        value={selectedScopeTarget}
                        onChange={(val) => setValue('scopeTarget', val)}
                    />
                </div>

                <div className={selectedScopeTarget === 'global' ? 'opacity-50 pointer-events-none' : ''}>
                    <Label className="mb-1.5 inline-block text-neutral-400">
                        Access Level{' '}
                        {selectedScopeTarget === 'global' && (
                            <span className="text-[10px] ml-2 text-orange-500">(Global is always Read-Write)</span>
                        )}
                    </Label>
                    <CustomSelect
                        options={accessOptions}
                        value={selectedScopeTarget === 'global' ? 'read-write' : selectedAccessLevel}
                        onChange={(val) => setValue('accessLevel', val as any)}
                    />
                </div>

                <div>
                    <Label className="mb-1.5 inline-block text-neutral-400">Expiration Period</Label>
                    <CustomSelect
                        options={expirationOptions}
                        value={selectedExpiration}
                        onChange={(val) => setValue('expiration', val as any)}
                    />
                </div>
            </form>
        </Modal>
    );
};
