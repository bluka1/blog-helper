import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react';
import { getPosts } from '../api/posts/getPosts';
import { useLoadingContext } from './LoadingContextProvider';
import type { Post, ChildrenProp } from '../interfaces';
import { useAuthContext } from './AuthContextProvider';

interface PostsContextType {
	posts: Post[] | null;
	refreshPosts: () => Promise<void>;
}

const PostsContext = createContext<PostsContextType>({
	posts: null,
	refreshPosts: async () => {},
});

const usePostsContext = () => useContext(PostsContext);

const PostsProvider = ({ children }: ChildrenProp) => {
	const [posts, setPosts] = useState<Post[] | null>(null);
	const { setIsLoading } = useLoadingContext();
	const { isAuthenticated } = useAuthContext();

	const fetchPosts = useCallback(async () => {
		setIsLoading(true);
		try {
			const postsData = await getPosts();
			setPosts(postsData);
		} catch (e) {
			console.error('Failed to fetch posts:', e);
		} finally {
			setIsLoading(false);
		}
	}, [setIsLoading]);

	useEffect(() => {
		if (isAuthenticated) {
			fetchPosts();
		}
	}, [isAuthenticated, fetchPosts]);

	return (
		<PostsContext.Provider value={{ posts, refreshPosts: fetchPosts }}>
			{children}
		</PostsContext.Provider>
	);
};

export { PostsContext, usePostsContext, PostsProvider };
