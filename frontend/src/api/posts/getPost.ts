import { POSTS_API_URL } from "../../constants";
import { apiFetch } from "../client";
import type { Post } from "../../interfaces/Post";

export const getPost = async (id: number): Promise<Post> => {
  const response = await apiFetch(`${POSTS_API_URL}/${id}`);
  if (!response.ok) {
    throw new Error('Post not found');
  }
  return response.json();
}
