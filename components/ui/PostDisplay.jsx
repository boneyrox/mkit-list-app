const PostDisplay = ({ post }) => (
  <>
    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-tight">
      {post.title}
    </h1>
    <p className="text-gray-700 leading-relaxed mb-6">{post.body}</p>
    <p className="text-sm text-gray-500 border-t border-gray-200 pt-4 mt-6">
      Post ID: {post.id} | User ID: {post.userId}
    </p>
  </>
);

export default PostDisplay;
