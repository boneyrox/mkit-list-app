import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { StarFilledIcon, StarOutlineIcon } from "@/assets/icons";

// Constants
const API_URL = "https://jsonplaceholder.typicode.com/posts";

// Component for favorite toggle button
const FavoriteButton = ({ post, isFavorite, onToggle }) => (
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

// Component for post list item
const PostItem = ({ post, isFavorite, onToggleFavorite }) => (
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

// Component for favorites summary
const FavoritesSummary = ({ count }) => (
  <div
    className="mt-4 mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md"
    aria-live="polite"
  >
    <p className="text-gray-700 font-medium">
      You have <span className="text-yellow-600 font-bold">{count}</span>{" "}
      favorite {count === 1 ? "post" : "posts"}
    </p>
  </div>
);

// Component for search bar
const SearchBar = ({
  value,
  onChange,
  showOnlyFavorites,
  onToggleFavorites,
}) => (
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

// Component for empty state
const EmptyState = ({ showOnlyFavorites }) => (
  <li className="text-center text-gray-500 p-4 bg-gray-50 rounded-md">
    {showOnlyFavorites
      ? "No favorites match your filter."
      : "No posts match your filter."}
  </li>
);

// Main data fetching function
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

// Custom hook for managing favorites
function useFavorites() {
  const [favorites, setFavorites] = useState({});
  const [announcement, setAnnouncement] = useState("");

  // Load favorites from localStorage
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

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favorites]);

  // Toggle favorite and announce change
  const toggleFavorite = (postId, postTitle) => {
    const isFavorite = favorites[postId];

    setFavorites((prev) => {
      const updatedFavorites = { ...prev };
      if (updatedFavorites[postId]) {
        delete updatedFavorites[postId];
      } else {
        updatedFavorites[postId] = true;
      }
      return updatedFavorites;
    });

    setAnnouncement(
      isFavorite
        ? `Removed ${postTitle} from favorites`
        : `Added ${postTitle} to favorites`
    );

    setTimeout(() => setAnnouncement(""), 2000);
  };

  // Count favorites
  const getFavoritesCount = () =>
    Object.values(favorites).filter(Boolean).length;

  return {
    favorites,
    announcement,
    toggleFavorite,
    getFavoritesCount,
  };
}

// Custom hook for filtering posts
function usePostFiltering(initialPosts, favorites) {
  const [filter, setFilter] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  // Apply filters when dependencies change
  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    let filtered = initialPosts.filter((post) =>
      post.title.toLowerCase().includes(lowerCaseFilter)
    );

    if (showOnlyFavorites) {
      filtered = filtered.filter((post) => favorites[post.id]);
    }

    setFilteredPosts(filtered);
  }, [filter, initialPosts, favorites, showOnlyFavorites]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const toggleShowOnlyFavorites = () => {
    setShowOnlyFavorites((prev) => !prev);
  };

  return {
    filter,
    filteredPosts,
    showOnlyFavorites,
    handleFilterChange,
    toggleShowOnlyFavorites,
  };
}

// Main component
export default function HomePage({ initialPosts, error }) {
  // Refs
  const mainContentRef = useRef(null);

  // Custom hooks
  const { favorites, announcement, toggleFavorite, getFavoritesCount } =
    useFavorites();
  const {
    filter,
    filteredPosts,
    showOnlyFavorites,
    handleFilterChange,
    toggleShowOnlyFavorites,
  } = usePostFiltering(initialPosts, favorites);

  const skipToContent = () => {
    mainContentRef.current?.focus();
  };

  // Error and empty states
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

  const favoritesCount = getFavoritesCount();

  return (
    <>
      <Head>
        <title>Item Browser - JSONPlaceholder Posts</title>
        <meta
          name="description"
          content="Browse and favorite posts from JSONPlaceholder"
        />
      </Head>

      <a
        href="#main-content"
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:z-10 focus:p-4 focus:bg-white focus:text-blue-600 focus:border focus:border-blue-600"
      >
        Skip to main content
      </a>

      <div className="sr-only" role="status" aria-live="polite">
        {announcement}
      </div>

      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
              Item Browser (JSONPlaceholder Posts)
            </h1>
          </div>
        </header>

        <main
          id="main-content"
          ref={mainContentRef}
          className="container mx-auto p-4 md:p-8 max-w-3xl flex-grow"
          tabIndex="-1"
        >
          <SearchBar
            value={filter}
            onChange={handleFilterChange}
            showOnlyFavorites={showOnlyFavorites}
            onToggleFavorites={toggleShowOnlyFavorites}
          />

          {favoritesCount > 0 && <FavoritesSummary count={favoritesCount} />}

          <div className="sr-only" aria-live="polite">
            {filteredPosts.length} posts displayed
          </div>

          <nav aria-label="Posts">
            <ul
              className="list-none p-0 space-y-3"
              aria-label={showOnlyFavorites ? "Favorite posts" : "All posts"}
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostItem
                    key={post.id}
                    post={post}
                    isFavorite={favorites[post.id]}
                    onToggleFavorite={toggleFavorite}
                  />
                ))
              ) : (
                <EmptyState showOnlyFavorites={showOnlyFavorites} />
              )}
            </ul>
          </nav>
        </main>

        <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>Item Browser Application - Accessible Demo</p>
          </div>
        </footer>
      </div>
    </>
  );
}
