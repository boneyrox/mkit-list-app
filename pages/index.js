import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

// getStaticProps remains the same as before
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
  const [filter, setFilter] = useState("");
  const [filteredPosts, setFilteredPosts] = useState(initialPosts);

  useEffect(() => {
    const lowerCaseFilter = filter.toLowerCase();
    const filtered = initialPosts.filter((post) =>
      post.title.toLowerCase().includes(lowerCaseFilter)
    );
    setFilteredPosts(filtered);
  }, [filter, initialPosts]);

  if (error) {
    return (
      <div className="text-red-600 text-center p-8">
        Error fetching posts: {error}
      </div>
    );
  }
  if (!initialPosts || (initialPosts.length === 0 && !error)) {
    return (
      <div className="container mx-auto p-8 text-center">
        No posts found or failed to load.
      </div>
    );
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    // Apply Tailwind classes directly
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">
        Item Browser (JSONPlaceholder Posts)
      </h1>

      <input
        type="text"
        placeholder="Filter posts by title..."
        value={filter}
        onChange={handleFilterChange}
        className="block w-full p-3 border border-gray-300 rounded-md mb-6 shadow-sm focus:ring-blue-500 focus:border-blue-500"
      />

      <ul className="list-none p-0">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <li
              key={post.id}
              className="mb-3 p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors duration-150 ease-in-out"
            >
              <Link
                href={`/items/${post.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {post.id}: {post.title}
              </Link>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No posts match your filter.
          </p>
        )}
      </ul>
    </div>
  );
}
