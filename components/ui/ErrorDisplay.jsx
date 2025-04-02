import Link from "next/link";

const ErrorDisplay = ({ title, message, id }) => (
  <div className="text-center py-8">
    <div className="text-red-500 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-16 h-16 mx-auto"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
    </div>
    <h1 className="text-2xl font-bold mb-4 text-gray-800">{title}</h1>
    <p className="text-gray-600 mb-2">{message}</p>
    {id && <p className="text-sm text-gray-500 mb-6">Requested ID: {id}</p>}
    <Link
      href="/"
      className="inline-block px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Return to Post List
    </Link>
  </div>
);

export default ErrorDisplay;
