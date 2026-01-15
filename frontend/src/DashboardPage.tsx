import { Card } from "./Card";
import type { Post } from "./interfaces/Post";
import { usePostsContext } from "./providers/PostsProvider";

export const DashboardPage = () => {
  const { posts } = usePostsContext();
  return (
    <>
      <h2>Posts</h2>
      <div>
        {posts?.map((post: Post) => (
          <Card key={post.id} title={post.title} id={post.id} />
        ))}
      </div>
    </>
  );
}
