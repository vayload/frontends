import { ArrowLeft, Cpu, Lock, ArrowRight, User, Mail } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Logo } from '../brand/Logo';
import { useAuth } from '@/hooks/useAuth';

export const AuthPage = () => {
	const { login, register, loginWithOAuth, isLoading, error, clearError } = useAuth();
	const [isLogin, setIsLogin] = useState(true);

	const [loginForm, setLoginForm] = useState({
		email: '',
		password: '',
	});

	const [registerForm, setRegisterForm] = useState({
		username: '',
		email: '',
		password: '',
	});

	const handleLogin = async () => {
		if (!loginForm.email || !loginForm.password) {
			return;
		}

		try {
			await login(loginForm.email, loginForm.password);
		} catch (error) {
			// El error ya es manejado por el hook
		}
	};

	const handleRegister = async () => {
		if (!registerForm.username || !registerForm.email || !registerForm.password) {
			return;
		}

		try {
			await register(registerForm.username, registerForm.email, registerForm.password);
		} catch (error) {
			// El error ya es manejado por el hook
		}
	};

	const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoginForm((prev) => ({ ...prev, [name]: value }));
		if (error) clearError();
	};

	const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setRegisterForm((prev) => ({ ...prev, [name]: value }));
		if (error) clearError();
	};

	const handleOAuthLogin = (provider: 'github' | 'google') => {
		loginWithOAuth(provider);
	};

	return (
		<div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 relative overflow-hidden">
			<a
				href="/"
				className="text-white flex items-center gap-2 absolute top-6 left-6 hover:text-orange-500 transition-colors"
			>
				<ArrowLeft size={18} />
				Home
			</a>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-orange-600/10 rounded-full blur-[100px] -z-10"></div>

			<div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500">
				<div className="text-center mb-8">
					<div className="w-12 h-12 flex items-center justify-center text-white font-bold mx-auto mb-4">
						<Logo size={42} />
					</div>
					<h2 className="text-3xl font-bold text-white mb-2">Welcome to Vayload Plug</h2>
					<p className="text-neutral-400">The official registry for Vayload CMS plugins</p>
				</div>

				<Card className="bg-transparent border-none">
					<div className="flex mb-6 border-b border-neutral-800">
						<button
							onClick={() => setIsLogin(true)}
							className={`flex-1 cursor-pointer pb-3 text-sm font-medium transition-colors relative ${isLogin ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
						>
							Sign In
							{isLogin && (
								<div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></div>
							)}
						</button>
						<button
							onClick={() => setIsLogin(false)}
							className={`flex-1 cursor-pointer pb-3 text-sm font-medium transition-colors relative ${!isLogin ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
						>
							Sign Up
							{!isLogin && (
								<div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></div>
							)}
						</button>
					</div>

					<div className="space-y-4">
						{!isLogin && (
							<div className="space-y-1.5">
								<Label>Usuario</Label>
								<div className="relative">
									<User size={16} className="absolute left-3 top-3 text-neutral-500" />
									<Input
										type="text"
										placeholder="Username"
										name="username"
										className="pl-10"
										onChange={handleRegisterInputChange}
										value={registerForm.username}
									/>
								</div>
							</div>
						)}

						<div className="space-y-1.5">
							<Label>Email</Label>
							<div className="relative">
								<Mail size={16} className="absolute left-3 top-3 text-neutral-500" />
								<Input
									type="email"
									placeholder="Email"
									name="email"
									className="pl-10"
									onChange={isLogin ? handleLoginInputChange : handleRegisterInputChange}
									value={isLogin ? loginForm.email : registerForm.email}
								/>
							</div>
						</div>

						<div className="space-y-1.5">
							<Label>Password</Label>
							<div className="relative">
								<Lock size={16} className="absolute left-3 top-3 text-neutral-500" />
								<Input
									type="password"
									placeholder="••••••••"
									name="password"
									className="pl-10"
									onChange={isLogin ? handleLoginInputChange : handleRegisterInputChange}
									value={isLogin ? loginForm.password : registerForm.password}
								/>
							</div>
						</div>

						{error && (
							<div className="bg-red-600/20 border border-red-600/50 rounded-lg p-3 text-red-400 text-sm">
								{error}
							</div>
						)}

						<Button
							className="w-full mt-2 py-3"
							onClick={isLogin ? handleLogin : handleRegister}
							isLoading={isLoading}
							disabled={
								isLoading ||
								(isLogin
									? !loginForm.email || !loginForm.password
									: !registerForm.username || !registerForm.email || !registerForm.password)
							}
							rightIcon={!isLoading && <ArrowRight size={16} />}
						>
							{isLogin ? 'Login' : 'Register'}
						</Button>

						<div className="relative py-3">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-neutral-800"></div>
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-neutral-900 px-2 text-neutral-500">O continúa con</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<Button
								variant="secondary"
								size="md"
								className="w-full"
								onClick={() => handleOAuthLogin('github')}
								disabled={isLoading}
								leftIcon={
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
											fill="currentColor"
										/>
									</svg>
								}
							>
								GitHub
							</Button>
							<Button
								variant="secondary"
								size="md"
								className="w-full"
								onClick={() => handleOAuthLogin('google')}
								disabled={isLoading}
								leftIcon={
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
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
								}
							>
								Google
							</Button>
						</div>
					</div>
				</Card>

				<p className="text-center text-neutral-500 text-sm mt-6">
					Having trouble signing in?
					<a href="#" className="text-orange-500 hover:underline ml-1">
						Recover your account
					</a>
				</p>
			</div>
		</div>
	);
};
