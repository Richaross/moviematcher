'use client';

import { useMovieStore } from '@/store/useMovieStore';
import { Film } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import WatchlistControls from '@/components/WatchlistControls';
import { WatchlistItem } from '@/components/WatchlistItem';
import { useMemo } from 'react';
import { filterWatchlist, sortWatchlist, WatchlistMovie } from '@/utils/watchlistUtils';

export default function WatchlistPage() {
    const { watchlist, watchlistFilter } = useMovieStore();

    // Derive filtered list
    const filteredMovies = useMemo(() => {
        // Fallback if watchlistFilter is undefined
        const safeFilter = watchlistFilter || { search: '', watched: 'all', sortBy: 'title' };

        let movies = filterWatchlist(watchlist as WatchlistMovie[], safeFilter);
        movies = sortWatchlist(movies, safeFilter.sortBy);
        return movies;
    }, [watchlist, watchlistFilter]);

    // 1. Global Empty State (No movies added yet)
    if (watchlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 border border-gray-700">
                    <Film className="w-10 h-10 text-gray-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your watchlist is empty</h2>
                <p className="text-gray-400 max-w-md">
                    Head back to the discover page and swipe right on some movies to build your list.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto pb-10">
            <header className="mb-8 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">Your Watchlist</h1>
                <p className="text-gray-400">
                    You have {watchlist.length} movie{watchlist.length === 1 ? '' : 's'} saved to watch.
                </p>
            </header>

            <WatchlistControls />

            {/* 2. Filtered Empty State (Movies exist, but filtered out) */}
            {filteredMovies.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No movies match your filters.</p>
                    <button
                        onClick={() => useMovieStore.getState().setWatchlistFilter({ search: '', watched: 'all' })}
                        className="mt-4 text-purple-400 hover:text-purple-300 underline"
                    >
                        Clear filters
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
                <AnimatePresence mode="popLayout">
                    {filteredMovies.map((movie) => (
                        <WatchlistItem key={movie.id} movie={movie} />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
