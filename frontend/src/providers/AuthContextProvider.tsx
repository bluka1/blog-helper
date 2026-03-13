import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type {
	ChildrenProp,
	CurrentUser,
	AuthContextValue,
} from '../interfaces';
import { AUTH_SERVICE_URL } from '../constants';

function parseJwtPayload(token: string): CurrentUser | null {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return {
			auth0_id: payload.sub ?? '',
			name: payload.name ?? payload.email ?? '',
			email: payload.email ?? '',
		};
	} catch {
		return null;
	}
}

function resolveInitialToken(): string | null {
	const storedToken = localStorage.getItem('auth_token');
	if (storedToken) return storedToken;

	const tokenFromUrl = new URLSearchParams(window.location.search).get('token');
	if (tokenFromUrl) {
		localStorage.setItem('auth_token', tokenFromUrl);
		return tokenFromUrl;
	}

	return null;
}

const AuthContext = createContext<AuthContextValue>({
	isAuthenticated: false,
	token: null,
	currentUser: null,
	login: () => {},
	logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }: ChildrenProp) => {
	const [token, setToken] = useState<string | null>(resolveInitialToken);
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() =>
		token ? parseJwtPayload(token) : null,
	);
	const navigate = useNavigate();

	const isAuthenticated = !!token;

	const login = () => {
		window.location.href = `${AUTH_SERVICE_URL}/login`;
	};

	const logout = () => {
		localStorage.removeItem('auth_token');
		setToken(null);
		setCurrentUser(null);
		navigate('/');
	};

	useEffect(() => {
		const tokenFromUrl = new URLSearchParams(window.location.search).get(
			'token',
		);

		if (tokenFromUrl) {
			localStorage.setItem('auth_token', tokenFromUrl);
			setToken(tokenFromUrl);
			setCurrentUser(parseJwtPayload(tokenFromUrl));
			navigate('/', { replace: true });
		}
	}, [navigate]);

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				token,
				currentUser,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
