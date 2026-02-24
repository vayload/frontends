export {};

type AppEventCallback<T = unknown> = (payload: T) => void;

interface AppEventBus {
	subscribers: Record<string, AppEventCallback[]>;

	dispatch<T = unknown>(event: string, payload: T): void;
	listen<T = unknown>(event: string, cb: AppEventCallback<T>): () => void;
}

interface AppState {
	user: any;
	isLoggedIn: boolean;
	avatar: string;
	username: string;
	email: string;
}

declare global {
	const AppEvent: AppEventBus;

	interface Window {
		AppEvent: AppEventBus;
		AppState: AppState;
	}
}

declare global {
	interface Window {
		AppState: AppState;
		AppEvent: AppEventBus;
	}
}
