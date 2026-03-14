import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getPost, deletePost } from '../api/posts';
import { useAuthContext, usePostsContext } from '../providers';
import type { Post as PostType } from '../interfaces';

export const Post = () => {
	const { id } = useParams<{ id: string }>();
	const [post, setPost] = useState<PostType | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { currentUser } = useAuthContext();
	const navigate = useNavigate();
	const { refreshPosts } = usePostsContext();

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		getPost(+id)
			.then(setPost)
			.catch((e: Error) =>
				setError(
					e.message === 'Forbidden'
						? "You don't have access to this post."
						: 'Post not found.',
				),
			)
			.finally(() => setLoading(false));
	}, [id]);

	const handleDelete = async () => {
		if (!post || !window.confirm('Are you sure you want to delete this post?'))
			return;
		try {
			await deletePost(post.id);
			refreshPosts();
			navigate('/');
		} catch {
			setError('Failed to delete post.');
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>{error}</p>;
	if (!post) return <p>Post not found.</p>;

	const isAuthor = currentUser?.auth0_id === post.author_auth0_id;
	const formattedCreated = new Date(post.created_at).toLocaleDateString();
	const formattedUpdated = post.updated_at
		? new Date(post.updated_at).toLocaleDateString()
		: null;

	return (
		<div className='post'>
			<h2>{post.title}</h2>
			<div>
				<span>
					by {post.author_name} | {formattedCreated}
				</span>
				{formattedUpdated && <span> | updated on {formattedUpdated}</span>}
			</div>
			<p>{post.content}</p>
			{isAuthor && (
				<div>
					<button className='btn' onClick={() => navigate(`/${post.id}/edit`)}>
						Edit
					</button>
					<button className='btn' onClick={handleDelete}>
						Delete
					</button>
				</div>
			)}
		</div>
	);
};
