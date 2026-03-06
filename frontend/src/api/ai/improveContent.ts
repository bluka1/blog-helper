import { AI_API_URL } from "../../constants";
import { apiFetch } from "../client";

export type ContentStyle = "formalan" | "neformalan" | "tehnicki";

export const improveContent = async (content: string, style?: ContentStyle): Promise<string> => {
  const response = await apiFetch(`${AI_API_URL}/ai-improve`, {
    method: 'POST',
    body: JSON.stringify({ content, style }),
  });
  if (!response.ok) {
    throw new Error('Failed to improve content');
  }
  return response.json();
}
