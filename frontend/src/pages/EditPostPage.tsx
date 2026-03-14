import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getPost, updatePost } from '../api/posts';
import { improveContent } from '../api/ai';
import { usePostsContext } from '../providers';
import { InputGroup } from '../components/InputGroup';
import { FormButton } from '../components/FormButton';

export const EditPostPage = () => {
	const { id } = useParams<{ id: string }>();
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [contentSuggestion, setContentSuggestion] = useState<string | null>(
		null,
	);
	const suggestionRef = useRef<HTMLTextAreaElement | null>(null);
	const navigate = useNavigate();
	const { refreshPosts } = usePostsContext();

	useEffect(() => {
		if (!id) return;
		getPost(+id)
			.then((post) => {
				setTitle(post.title);
				setContent(post.content);
			})
			.catch(() => setError('Failed to load post.'))
			.finally(() => setIsLoading(false));
	}, [id]);

	useEffect(() => {
		const el = suggestionRef.current;
		if (!el) return;
		el.style.height = 'auto';
		el.style.height = `${el.scrollHeight}px`;
	}, [contentSuggestion]);

	const withLoading = async (
		action: () => Promise<void>,
		errorMessage: string,
		message: string,
	) => {
		setError(null);
		setIsLoading(true);
		setLoadingMessage(message);
		try {
			await action();
		} catch {
			setError(errorMessage);
		} finally {
			setIsLoading(false);
			setLoadingMessage(null);
		}
	};

	const handleImproveContent = () =>
		withLoading(
			async () => {
				setContentSuggestion(await improveContent(content));
			},
			'Failed to improve content.',
			'Improving content...',
		);

	const handleAcceptSuggestion = () => {
		if (!contentSuggestion) return;
		setContent(contentSuggestion);
		setContentSuggestion(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) {
			setError('Title and content are required.');
			return;
		}
		await withLoading(
			async () => {
				await updatePost(+id!, title, content);
				await refreshPosts();
				navigate(`/${id}`);
			},
			'Failed to update post.',
			'Saving post...',
		);
	};

	if (isLoading && !loadingMessage) return <p>Loading...</p>;
	if (error && !title) return <p>{error}</p>;

	return (
		<>
			<h2>Edit Post</h2>
			<form onSubmit={handleSubmit}>
				{error && <p>{error}</p>}
				{loadingMessage && (
					<p className='loading-indicator'>
						<span className='loading-spinner' />
						{loadingMessage}
					</p>
				)}

				<InputGroup
					label='Title'
					type='text'
					id='title'
					name='title'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>

				<InputGroup
					label='Content'
					type='textarea'
					id='content'
					name='content'
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>

				<FormButton
					label='Improve text'
					onClick={handleImproveContent}
					disabled={isLoading}
				/>

				{contentSuggestion && (
					<section>
						<InputGroup
							label='Improved text (suggestion)'
							type='textarea'
							id='content-suggestion'
							name='content-suggestion'
							ref={suggestionRef}
							value={contentSuggestion}
							readOnly
						/>
						<FormButton
							label='Accept suggestion'
							onClick={handleAcceptSuggestion}
							disabled={isLoading}
						/>
						<FormButton
							label='Dismiss'
							onClick={() => setContentSuggestion(null)}
							disabled={isLoading}
						/>
					</section>
				)}

				<FormButton
					label='Save post'
					onClick={handleSubmit}
					disabled={isLoading || !title.trim() || !content.trim()}
				/>
			</form>
		</>
	);
};
