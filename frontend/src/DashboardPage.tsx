import { Card } from './Card';
import type { Post } from './interfaces/Post';
import { usePostsContext } from './providers/PostsProvider';

export const DashboardPage = () => {
	const { posts } = usePostsContext();
	return (
		<>
			<h2>Blog posts</h2>
			<section className='posts-container'>
				{posts?.map((post: Post) => (
					<Card
						key={post.id}
						id={post.id}
						title={post.title}
						author_name={post.author_name}
						created_at={post.created_at}
						excerpt={
							post.content.slice(0, 150) +
							(post.content.length > 150 ? '...' : '')
						}
					/>
				))}
			</section>
		</>
	);
};
