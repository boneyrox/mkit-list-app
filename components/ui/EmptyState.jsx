export default function EmptyState({ showOnlyFavorites }) {
  return (
    <li className="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
      {showOnlyFavorites
        ? "No favorites match your filter."
        : "No posts match your filter."}
    </li>
  );
}
