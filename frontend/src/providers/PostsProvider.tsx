import { createContext, useContext, useEffect, useState } from "react";
import { getPosts } from "../api/posts/getPosts";
import { useLoadingContext } from "./LoadingContextProvider";
import type { Post } from "../interfaces/Post";
import { useAuthContext } from "./AuthContextProvider";
import type { Props } from "../interfaces/Props";

interface PostsContextType {
  posts: Post[] | null;
}

const PostsContext = createContext<PostsContextType>({ posts: null });

const usePostsContext = () => useContext(PostsContext);

const PostsProvider = ({ children }: Props) => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const {setIsLoading} = useLoadingContext();
  const {isAuthenticated} = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      const postsData: Post[] = await getPosts();
      setPosts(postsData);
      setIsLoading(false);
    };
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  return <PostsContext.Provider value={{ posts }}>{children}</PostsContext.Provider>;
};

export { PostsContext, usePostsContext, PostsProvider };
