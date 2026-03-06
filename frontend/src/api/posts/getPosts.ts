import { POSTS_API_URL } from "../../constants";
import { apiFetch } from "../client";
import type { Post } from "../../interfaces/Post";

export const getPosts = async (): Promise<Post[]> => {
  const response = await apiFetch(`${POSTS_API_URL}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
}
