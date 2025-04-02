const LoadingState = () => (
  <div className="flex flex-col items-center justify-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
    <p className="text-gray-600">Loading post details...</p>
    <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
  </div>
);

export default LoadingState;
