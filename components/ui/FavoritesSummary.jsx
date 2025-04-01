export default function FavoritesSummary({ count }) {
  return (
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
}
