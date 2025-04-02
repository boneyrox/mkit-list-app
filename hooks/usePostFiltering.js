import { useState, useEffect } from "react";

export default function usePostFiltering(initialPosts, favorites) {
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
