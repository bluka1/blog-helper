import { AI_API_URL } from "../../constants";

export async function generateBlogStream(
  title: string,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const token = localStorage.getItem("auth_token");

  const response = await fetch(`${AI_API_URL}/ai-complete/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      prompt: `Generate a blog post with no more than 200 words based on the given title. The title is: ${title}`,
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error('Failed to start stream');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n');

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const chunk = JSON.parse(data) as string;
        onChunk(chunk);
      } catch {
        // skip malformed lines
      }
    }
  }

}
