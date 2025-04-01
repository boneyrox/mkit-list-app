import { useState, useEffect } from "react";
import Link from "next/link";

import { StarFilledIcon, StarOutlineIcon } from "@/assets/icons";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export async function getStaticProps() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error("Failed to fetch posts during build");
      throw new Error(`Failed to fetch posts, status: ${res.status}`);
    }
    const posts = await res.json();
    return { props: { initialPosts: posts } };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return { props: { initialPosts: [], error: error.message } };
  }
}

export default function HomePage({ initialPosts, error }) {
  // State management
  const [filter, setFilter] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);
  const [favorites, setFavorites] = useState({});
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    }
  }, []);

  // Persist favorites to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  // Filter posts based on search text and favorites toggle
  useEffect(() => {
    // Filter by text search
    const lowerCaseFilter = filter.toLowerCase();
    let filtered = initialPosts.filter((post) =>
      post.title.toLowerCase().includes(lowerCaseFilter)
    );

    // Apply favorites filter if needed
    if (showOnlyFavorites) {
      filtered = filtered.filter((post) => favorites[post.id]);
    }

    setFilteredPosts(filtered);
  }, [filter, initialPosts, favorites, showOnlyFavorites]);

  // Event handlers
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const toggleFavorite = (postId) => {
    setFavorites((prev) => {
      const updatedFavorites = { ...prev };
      if (updatedFavorites[postId]) {
        delete updatedFavorites[postId];
      } else {
        updatedFavorites[postId] = true;
      }
      return updatedFavorites;
    });
  };

  const toggleShowOnlyFavorites = () => {
    setShowOnlyFavorites((prev) => !prev);
  };

  // UI rendering conditions
  if (error) {
    return (
      <div className="text-red-600 text-center p-8">
        <h2 className="text-xl font-medium mb-2">Error fetching posts</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!initialPosts || (initialPosts.length === 0 && !error)) {
    return (
      <div className="container mx-auto p-8 text-center">
        <p className="text-gray-600">No posts found or failed to load.</p>
      </div>
    );
  }

  // Count of active favorites
  const favoritesCount = Object.values(favorites).filter(Boolean).length;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Item Browser (JSONPlaceholder Posts)
      </h1>

      {/* Filters and controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter posts by title..."
          value={filter}
          onChange={handleFilterChange}
          className="flex-grow p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />

        <button
          onClick={toggleShowOnlyFavorites}
          className={`px-4 py-2 rounded-md transition-colors duration-150 cursor-pointer ${
            showOnlyFavorites
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {showOnlyFavorites ? "Show All" : "Show Favorites"}
        </button>
      </div>

      {/* Favorites summary */}
      {favoritesCount > 0 && (
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-gray-700 font-medium">
            You have{" "}
            <span className="text-yellow-600 font-bold">{favoritesCount}</span>{" "}
            favorite {favoritesCount === 1 ? "post" : "posts"}
          </p>
        </div>
      )}
      {/* Posts list */}
      <ul className="list-none p-0 space-y-3 mt-8">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <li
              key={post.id}
              className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150 flex justify-between items-center group"
            >
              <Link
                href={`/items/${post.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium group-hover:text-blue-700"
              >
                <span className="font-medium text-gray-500 mr-2">
                  {post.id}:
                </span>
                {post.title}
              </Link>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(post.id);
                }}
                className="ml-4 text-yellow-500 hover:text-yellow-700 focus:outline-none transition-colors cursor-pointer"
                aria-label={
                  favorites[post.id]
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {favorites[post.id] ? (
                  <StarFilledIcon className="w-6 h-6" />
                ) : (
                  <StarOutlineIcon className="w-6 h-6" />
                )}
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
            {showOnlyFavorites
              ? "No favorites match your filter."
              : "No posts match your filter."}
          </p>
        )}
      </ul>
    </div>
  );
}
