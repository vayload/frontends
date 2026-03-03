import { useEffect, useState } from 'react';
import { Card } from '../atoms/Card';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '../atoms/Button';
import { useAuth } from '@/hooks/useAuth';

export const EmailVerifyPage = () => {
    const { verifyEmail, isLoading } = useAuth();
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const t = urlParams.get('token');
        setToken(t);

        if (t) {
            handleVerify(t);
        } else {
            setStatus('error');
        }
    }, []);

    const handleVerify = async (verificationToken: string) => {
        setStatus('verifying');
        try {
            await verifyEmail(verificationToken);
            setStatus('success');
        } catch (err) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-600/10 rounded-full blur-[100px] -z-10"></div>

            <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
                <Card className="bg-neutral-900/50 border-neutral-800 p-10 text-center">
                    {status === 'verifying' && (
                        <>
                            <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                <Loader2 size={32} className="animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Verifying Email</h2>
                            <p className="text-neutral-400">Please wait while we verify your email address...</p>
                        </>
                    )}

                    {status === 'success' && (
                        <>
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
                            <p className="text-neutral-400 mb-8">
                                Your email has been verified correctly. You can now access all features of Vayload
                                Registry.
                            </p>
                            <Button
                                className="w-full py-3"
                                onClick={() => (window.location.href = '/dev')}
                                rightIcon={<ArrowRight size={16} />}
                            >
                                Go to Dashboard
                            </Button>
                        </>
                    )}

                    {status === 'error' && (
                        <>
                            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <XCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
                            <p className="text-neutral-400 mb-8">
                                The verification link is invalid or has expired. Please try resending the verification
                                email.
                            </p>
                            <div className="space-y-4">
                                {token && (
                                    <Button
                                        variant="secondary"
                                        className="w-full py-3"
                                        onClick={() => handleVerify(token)}
                                        isLoading={isLoading}
                                    >
                                        Try again
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    className="w-full py-3"
                                    onClick={() => (window.location.href = '/auth')}
                                >
                                    Back to Sign In
                                </Button>
                            </div>
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};
