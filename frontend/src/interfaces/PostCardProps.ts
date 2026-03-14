import type { Post } from './Post';

export interface PostCardProps extends Pick<
	Post,
	'id' | 'title' | 'author_name' | 'created_at'
> {
	excerpt: string;
}
