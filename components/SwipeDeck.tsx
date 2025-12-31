// Imports handled below

'use client';

import { useState } from 'react';
import MovieCard from './MovieCard';
import { AnimatePresence } from 'framer-motion';
import { Play, Filter } from 'lucide-react';
import Link from 'next/link';
import MovieFilters from './MovieFilters';
import { useMovieDeck } from '@/hooks/useMovieDeck';

export default function SwipeDeck() {
    const {
        deck,
        isLoaded,
        isLoadingMore,
        handleSwipe,
        handleLoadMore
    } = useMovieDeck();

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    if (!isLoaded && deck.length === 0) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full relative">

            <MovieFilters isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

            <div className="relative w-full max-w-sm h-[600px]">
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="absolute top-4 left-4 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-[200] hover:scale-110 active:scale-95 border border-white/10"
                    title="Filter Movies"
                >
                    <Filter className="w-6 h-6 text-white" />
                </button>
                <AnimatePresence>
                    {deck.map((movie, index) => (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            index={index}
                            onSwipe={(dir) => handleSwipe(dir, movie.id)}
                        />
                    ))}
                </AnimatePresence>

                {deck.length === 0 && isLoaded && (
                    <div className="flex flex-col items-center justify-center text-center p-8 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm w-full h-full min-h-[400px]">
                        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                            <Play className="w-10 h-10 text-gray-400 ml-1" />
                        </div>
                        <div className="text-center py-20 px-4">
                            <h2 className="text-2xl font-bold text-white mb-4">That&apos;s all for now!</h2>
                            <p className="text-gray-400 mb-8">
                                You&apos;ve gone through all the movies matching your filters.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 w-full max-w-xs">
                            <button
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="bg-white text-black font-bold py-3 px-8 rounded-full transition-all shadow-lg hover:bg-gray-200 active:scale-95 disabled:opacity-50"
                            >
                                {isLoadingMore ? 'Loading...' : 'Load Next 20 Movies'}
                            </button>

                            <Link
                                href="/watchlist"
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg shadow-red-900/40"
                            >
                                Go to Watchlist
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
