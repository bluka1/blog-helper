import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { generateBlogStream, improveContent, suggestTitle } from '../api/ai';
import { createPost } from '../api/posts';
import { usePostsContext } from '../providers';
import { InputGroup } from './InputGroup';
import { FormButton } from './FormButton';

export const NewPostForm = () => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [contentSuggestion, setContentSuggestion] = useState<string | null>(
		null,
	);
	const [titleSuggestions, setTitleSuggestions] = useState<string[] | null>(
		null,
	);
	const [error, setError] = useState<string | null>(null);
	const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

	const suggestionRef = useRef<HTMLTextAreaElement | null>(null);
	const navigate = useNavigate();
	const { refreshPosts } = usePostsContext();

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

	const handleGenerateBlog = async () => {
		if (!title.trim()) {
			setError('Enter a title before generating.');
			return;
		}
		await withLoading(
			async () => {
				setContent('');
				await generateBlogStream(title, (chunk) =>
					setContent((prev) => prev + chunk),
				);
			},
			'Failed to generate content.',
			'Generating blog post...',
		);
	};

	const handleImproveContent = async () => {
		if (!content.trim()) {
			setError('No content to improve.');
			return;
		}
		await withLoading(
			async () => {
				setContentSuggestion(await improveContent(content));
			},
			'Failed to improve content.',
			'Improving content...',
		);
	};

	const handleSuggestTitle = async () => {
		if (!content.trim()) {
			setError('Enter some content first to get title suggestions.');
			return;
		}
		await withLoading(
			async () => {
				setTitleSuggestions(await suggestTitle(content));
			},
			'Failed to generate title suggestions.',
			'Suggesting titles...',
		);
	};

	const submitPost = (postTitle: string, postContent: string) =>
		withLoading(
			async () => {
				const newPost = await createPost(postTitle, postContent);
				await refreshPosts();
				navigate(`/${newPost.id}`);
			},
			'Failed to create post. Please try again.',
			'Saving post...',
		);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title.trim() || !content.trim()) {
			setError('Title and content are required.');
			return;
		}
		await submitPost(title, content);
	};

	const handleAcceptSuggestion = () => {
		if (!contentSuggestion) return;
		setContent(contentSuggestion);
		setContentSuggestion(null);
	};

	return (
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

			<FormButton
				label='Generate blog from title'
				onClick={handleGenerateBlog}
				disabled={isLoading}
			/>
			<FormButton
				label='Suggest title'
				onClick={handleSuggestTitle}
				disabled={isLoading}
			/>

			{titleSuggestions && titleSuggestions.length > 0 && (
				<section className='title-suggestions-container'>
					<h3>Title suggestions:</h3>
					<ul className='title-suggestions'>
						{titleSuggestions.map((t, i) => (
							<li key={i}>
								<FormButton
									label={t}
									onClick={() => {
										setTitle(t);
										setTitleSuggestions(null);
									}}
									disabled={isLoading}
								/>
							</li>
						))}
					</ul>
					<FormButton
						label='Dismiss'
						onClick={() => setTitleSuggestions(null)}
						disabled={isLoading}
					/>
				</section>
			)}

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
				label='Create post'
				onClick={handleSubmit}
				disabled={isLoading || !title.trim() || !content.trim()}
			/>
		</form>
	);
};
