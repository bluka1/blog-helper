import { POSTS_API_URL } from "../../constants";
import { apiFetch } from "../client";
import type { Post } from "../../interfaces/Post";

export const createPost = async (title: string, content: string): Promise<Post> => {
  const response = await apiFetch(`${POSTS_API_URL}`, {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  return response.json();
}
