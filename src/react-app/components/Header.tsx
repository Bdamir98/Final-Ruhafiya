export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <a href="/" aria-label="Ruhafiya - Go to homepage">
            <img 
              src="/logo.png" 
              alt="Ruhafiya - Natural Pain Relief Oil" 
              className="h-12 w-auto" 
              width="120" 
              height="48"
              loading="eager"
              decoding="sync"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
