import Link from "next/link";

const BackButton = () => (
  <Link
    href="/"
    className="inline-block mb-6 text-blue-600 hover:text-blue-800 hover:underline"
  >
    &larr; Back to List
  </Link>
);

export default BackButton;
