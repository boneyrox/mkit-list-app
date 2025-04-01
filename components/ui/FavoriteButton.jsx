import { StarFilledIcon, StarOutlineIcon } from "@/assets/icons";

export default function FavoriteButton({ post, isFavorite, onToggle }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onToggle(post.id, post.title);
      }}
      className="ml-4 text-yellow-500 hover:text-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-full p-1 transition-colors cursor-pointer"
      aria-label={
        isFavorite
          ? `Remove ${post.title} from favorites`
          : `Add ${post.title} to favorites`
      }
      aria-pressed={!!isFavorite}
    >
      {isFavorite ? (
        <StarFilledIcon className="w-6 h-6" />
      ) : (
        <StarOutlineIcon className="w-6 h-6" />
      )}
    </button>
  );
}
