import { useState, useEffect } from "react";

export default function useFavorites() {
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
