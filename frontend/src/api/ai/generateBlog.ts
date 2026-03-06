import { AI_API_URL } from "../../constants";
import { apiFetch } from "../client";

export const generateBlog = async (title: string): Promise<string> => {
  const response = await apiFetch(`${AI_API_URL}/ai-complete`, {
    method: 'POST',
    body: JSON.stringify({ prompt: `Generate a blog post with no more than 100 words based on the given title. The title is: ${title}` }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate');
  }
  return response.json();
}
