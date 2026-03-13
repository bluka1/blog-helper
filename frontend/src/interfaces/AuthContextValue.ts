import type { CurrentUser } from './CurrentUser';

export interface AuthContextValue {
	isAuthenticated: boolean;
	token: string | null;
	currentUser: CurrentUser | null;
	login: () => void;
	logout: () => void;
}
