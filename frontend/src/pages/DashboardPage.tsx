import { PostCard } from '../components';
import type { Post } from '../interfaces';
import { usePostsContext } from '../providers';

export const DashboardPage = () => {
	const { posts } = usePostsContext();
	return (
		<>
			<h2>Blog posts</h2>
			<section className='posts-container'>
				{posts?.map((post: Post) => (
					<PostCard
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
