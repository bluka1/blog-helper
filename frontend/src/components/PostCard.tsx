import { NavLink } from 'react-router';
import type { PostCardProps } from '../interfaces';

export const PostCard = ({
	id,
	title,
	author_name,
	created_at,
	excerpt,
}: PostCardProps) => {
	const formattedDate = created_at
		? new Date(created_at).toLocaleDateString()
		: null;
	return (
		<NavLink className='card' to={`/${id}`}>
			<h2>{title}</h2>
			<p>
				By {author_name} | {formattedDate}
			</p>
			<p>{excerpt}</p>
		</NavLink>
	);
};
