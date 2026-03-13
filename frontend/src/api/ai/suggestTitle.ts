import { AI_API_URL } from "../../constants";
import { apiFetch } from "../client";

export const suggestTitle = async (content: string): Promise<string[]> => {
  const response = await apiFetch(`${AI_API_URL}/ai-suggest-title`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    throw new Error('Failed to suggest titles');
  }
  return response.json();
}
