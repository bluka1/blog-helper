import { POSTS_API_URL } from "../../constants";
import { apiFetch } from "../client";
import type { Post } from "../../interfaces/Post";

export const updatePost = async (id: number, title: string, content: string): Promise<Post> => {
  const response = await apiFetch(`${POSTS_API_URL}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) {
    throw new Error('Failed to update post');
  }
  return response.json();
}
