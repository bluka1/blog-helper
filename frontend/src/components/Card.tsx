import { NavLink } from 'react-router';
import type { Post } from '../interfaces';

interface CardProps extends Pick<
	Post,
	'id' | 'title' | 'author_name' | 'created_at'
> {
	excerpt: string;
}

export const Card = ({
	id,
	title,
	author_name,
	created_at,
	excerpt,
}: CardProps) => {
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
