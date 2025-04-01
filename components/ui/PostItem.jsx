import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

export default function PostItem({ post, isFavorite, onToggleFavorite }) {
  return (
    <li className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150 flex justify-between items-center group">
      <Link
        href={`/items/${post.id}`}
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium group-hover:text-blue-700 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 -m-1"
      >
        <span className="font-medium text-gray-500 mr-2">{post.id}:</span>
        {post.title}
      </Link>

      <FavoriteButton
        post={post}
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
      />
    </li>
  );
}
