import { useState } from "react";
import { generateBlog } from "./api/ai/generateBlog";
import { useLoadingContext } from "./providers/LoadingContextProvider";
import { usePostsContext } from "./providers/PostsProvider";
import { useNavigate } from "react-router";

export const CreateNewPostPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const {isLoading, setIsLoading} = useLoadingContext();
  const {posts} = usePostsContext();
  const navigate = useNavigate();

  const handleGenerateBlog = async () => {
    setIsLoading(true);
    try {
      const content = await generateBlog(title);
      setContent(content);

    } catch (error) {
      console.error('Error generating blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    posts?.push({ title, content, id: Date.now().toString() });
    navigate('/');
  }
  
  return (
    <>
      <h2>Create New Post</h2>
      <button className="btn" onClick={handleGenerateBlog}>Generiraj blog na temelju naslova</button>
      {isLoading && <p>Generating blog content...</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="title">Title:</label>
          <input type="text" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="input-group">
          <label htmlFor="content">Content:</label>
          <textarea id="content" name="content" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        </div>
        <button className="btn" type="submit">Create Post</button>
      </form>
    </>
  );
}
