import { POSTS_API_URL } from "../../constants";

export const getPosts = async () => {
  const response = await fetch(POSTS_API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data = await response.json();
  
  return data;
}
