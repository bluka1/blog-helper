export async function apiFetch(
	url: string,
	options: RequestInit = {},
): Promise<Response> {
	const token = localStorage.getItem('auth_token');

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) ?? {}),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(url, { ...options, headers });

	if (response.status === 401) {
		localStorage.removeItem('auth_token');
		window.location.href = '/';
	}

	if (response.status === 403) {
		throw new Error('Forbidden');
	}

	return response;
}
