
export const generateBlog = async (title: string) => {
  const response = await fetch('http://localhost:8003/ai-complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt: `Generate a blog post with no more than 100 words based on the given title. The title is: ${title}` }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate');
  }
  const data = await response.json();
  
  return data;
}
