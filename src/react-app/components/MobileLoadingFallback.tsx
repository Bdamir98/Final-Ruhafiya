export default function MobileLoadingFallback() {
  return (
    <div className="py-4 flex justify-center items-center" role="status" aria-label="Loading content">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}