import { useParams } from "react-router"
import { usePostsContext } from "./providers/PostsProvider";

export const Post = () => {
  const {id} = useParams();
  const {posts} = usePostsContext();
  
  const post = posts?.find(p => p.id == id);

  if (post) {
    return (<div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>)
  } else {
    return <p>No post found</p>
  }
}
