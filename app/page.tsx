import SwipeDeck from '@/components/SwipeDeck';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
          Discover
        </h1>
        <p className="text-gray-400">Swipe right to save to watchlist</p>
      </div>
      <SwipeDeck />
    </div>
  );
}
