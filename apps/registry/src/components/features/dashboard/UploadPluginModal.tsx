import { useState, useRef } from 'react';
import { Upload, File as FileIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { usePluginsStore } from '@/store/plugin.store';

interface UploadPluginModalProps {
    isOpen: boolean;
    pluginId: string;
    onClose: () => void;
}

const SUPPORTED_EXTENSIONS = ['.zip', '.tar.gz', '.tgz'];
const LIMIT_SIZE = 200 * 1024 * 1024; // 200MB

export const UploadPluginModal = ({ isOpen, onClose, pluginId }: UploadPluginModalProps) => {
    const { uploadPlugin, isUploading, error, clearError } = usePluginsStore();
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (!SUPPORTED_EXTENSIONS.some((ext) => selectedFile.name.endsWith(ext))) {
                return;
            }
            if (selectedFile.size > LIMIT_SIZE) {
                return;
            }
            setFile(selectedFile);
            clearError();
            setStatus('idle');
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            if (!SUPPORTED_EXTENSIONS.some((ext) => droppedFile.name.endsWith(ext))) {
                return;
            }
            if (droppedFile.size > LIMIT_SIZE) {
                return;
            }

            setFile(droppedFile);
            clearError();
            setStatus('idle');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus('uploading');
        try {
            await uploadPlugin(file);
            setStatus('success');
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err) {
            setStatus('error');
        }
    };

    const handleClose = () => {
        setFile(null);
        setStatus('idle');
        clearError();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload New Plugin"
            footer={
                <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={handleClose} disabled={isUploading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!file || isUploading || status === 'success'}
                        isLoading={isUploading}
                    >
                        {status === 'success' ? 'Uploaded!' : 'Upload ZIP'}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {!file ? (
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-neutral-800 rounded-2xl p-12 text-center hover:border-orange-500/50 hover:bg-neutral-900/50 transition-all cursor-pointer group"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept={SUPPORTED_EXTENSIONS.join(',')}
                            className="hidden"
                        />
                        <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-800 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                            <Upload size={32} />
                        </div>
                        <h3 className="text-white font-semibold mb-2">
                            Select {SUPPORTED_EXTENSIONS.join(', ')} Archive
                        </h3>
                        <p className="text-neutral-500 text-sm max-w-xs mx-auto">
                            Drag and drop your plugin archive or click to browse. Only {SUPPORTED_EXTENSIONS.join(', ')}{' '}
                            files are supported.
                        </p>
                    </div>
                ) : (
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-600/10 rounded-lg flex items-center justify-center text-orange-500 border border-orange-500/20">
                                    <FileIcon size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium truncate max-w-[200px]">{file.name}</h4>
                                    <p className="text-neutral-500 text-xs">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            {!isUploading && status !== 'success' && (
                                <button
                                    onClick={() => setFile(null)}
                                    className="text-neutral-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                            {status === 'success' && (
                                <div className="text-emerald-500 animate-in zoom-in duration-300">
                                    <CheckCircle2 size={24} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-500">
                        <AlertCircle size={20} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                <div className="bg-neutral-950/50 rounded-xl p-4 border border-neutral-800">
                    <h5 className="text-[10px] uppercase font-bold text-neutral-500 mb-2 tracking-wider">
                        Requirements
                    </h5>
                    <ul className="text-xs text-neutral-400 space-y-1.5">
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1" />
                            Must contain a valid `plugin.json` file.
                        </li>
                        <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1" />
                            Maximum file size is {LIMIT_SIZE / 1024 / 1024}MB.
                        </li>
                    </ul>
                </div>
            </div>
        </Modal>
    );
};
