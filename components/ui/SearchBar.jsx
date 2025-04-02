export default function SearchBar({
  value,
  onChange,
  showOnlyFavorites,
  onToggleFavorites,
}) {
  return (
    <div
      role="search"
      aria-label="Filter posts"
      className="flex flex-col md:flex-row gap-4 mb-6"
    >
      <div className="flex-grow">
        <label htmlFor="filter-input" className="sr-only">
          Search by title
        </label>
        <input
          id="filter-input"
          type="text"
          placeholder="Filter posts by title..."
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button
        onClick={onToggleFavorites}
        aria-pressed={showOnlyFavorites}
        className={`px-4 py-2 rounded-md transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          showOnlyFavorites
            ? "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400"
        }`}
      >
        {showOnlyFavorites ? "Show All" : "Show Favorites"}
      </button>
    </div>
  );
}
