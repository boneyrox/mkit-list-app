import Link from "next/link";
import { useRouter } from "next/router";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export async function getStaticPaths() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
      console.error("Failed to fetch post list for paths");
      throw new Error(`Failed to fetch posts for paths, status: ${res.status}`);
    }
    const posts = await res.json();
    const paths = posts.map((post) => ({
      params: { id: post.id.toString() },
    }));
    return { paths, fallback: false };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return { paths: [], fallback: false };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { id } = params;
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) {
      if (res.status === 404) {
        return { notFound: true };
      }
      console.error(`Failed to fetch post ${id} during build`);
      throw new Error(`Failed to fetch post ${id}, status: ${res.status}`);
    }
    const post = await res.json();
    return { props: { post } };
  } catch (error) {
    console.error(`Error fetching post ${params.id}:`, error);
    return { notFound: true };
  }
}

export default function ItemDetail({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 my-8 bg-white border border-gray-200 rounded-lg shadow-md">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800 hover:underline"
      >
        &larr; Back to List
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-tight">
        {post.title}
      </h1>
      <p className="text-gray-700 leading-relaxed mb-6">{post.body}</p>
      <p className="text-sm text-gray-500 border-t border-gray-200 pt-4 mt-6">
        Post ID: {post.id} | User ID: {post.userId}
      </p>
    </div>
  );
}
