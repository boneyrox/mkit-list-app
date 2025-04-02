import { useRef } from "react";
import { API_URL } from "@/constants";
import PageLayout from "@/components/layout/PageLayout";
import { SearchBar, FavoritesSummary, EmptyState } from "@/components/ui";
import useFavorites from "@/hooks/useFavorites";
import usePostFiltering from "@/hooks/usePostFiltering";
import dynamic from "next/dynamic";

// Dynamically import components that aren't needed immediately
const PostItem = dynamic(() => import("@/components/ui/PostItem"), {
  loading: () => (
    <div className="animate-pulse h-24 bg-gray-100 rounded-md"></div>
  ),
});

// For components that are below the fold
const ScrollToTopButton = dynamic(
  () => import("@/components/ui/ScrollToTopButton"),
  {
    ssr: false, // Only load on client side
  }
);

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
    <PageLayout
      title="Item Browser - JSONPlaceholder Posts"
      description="Browse and favorite posts from JSONPlaceholder"
      mainRef={mainContentRef}
      skipToContentHandler={skipToContent}
      announcement={announcement}
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

      <ScrollToTopButton />
    </PageLayout>
  );
}
