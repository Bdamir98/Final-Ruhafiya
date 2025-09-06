export default function MobileLoadingFallback() {
  return (
    <div className="py-4" role="status" aria-label="Loading content">
      <span className="sr-only">Loading...</span>
    </div>
  );
}