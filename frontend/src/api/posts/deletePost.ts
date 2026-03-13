import { POSTS_API_URL } from '../../constants';
import { apiFetch } from '../client';

interface DeletePostResponse {
	message: string;
}

export const deletePost = async (id: number): Promise<DeletePostResponse> => {
	const response = await apiFetch(`${POSTS_API_URL}/${id}`, {
		method: 'DELETE',
	});
	if (!response.ok) {
		throw new Error('Failed to delete post');
	}
	return response.json();
};
