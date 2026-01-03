'use client';

import { useMovieStore } from '@/store/useMovieStore';
import { Film, Trash2, Eye, EyeOff, CheckSquare, XSquare } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import WatchlistControls from '@/components/WatchlistControls';
import { WatchlistItem } from '@/components/WatchlistItem';
import { useMemo, useState } from 'react';
import { filterWatchlist, sortWatchlist, WatchlistMovie, DEFAULT_WATCHLIST_FILTER } from '@/utils/watchlistUtils';

export default function WatchlistPage() {
    const {
        watchlist,
        watchlistFilter,
        removeMultipleFromWatchlist,
        markMultipleAsWatched,
        isSelectionMode,
        selectedMovieIds,
        toggleSelectionMode,
        toggleMovieSelection,
        selectAll,
        clearSelection
    } = useMovieStore();

    // Derive filtered list
    const filteredMovies = useMemo(() => {
        // Fallback if watchlistFilter is undefined
        const safeFilter = watchlistFilter || DEFAULT_WATCHLIST_FILTER;

        let movies = filterWatchlist(watchlist as WatchlistMovie[], safeFilter);
        movies = sortWatchlist(movies, safeFilter.sortBy);
        return movies;
    }, [watchlist, watchlistFilter]);

    // Handlers
    const handleBulkDelete = async () => {
        if (selectedMovieIds.length === 0) return;

        // Confirmation could be added here
        if (confirm(`Are you sure you want to remove ${selectedMovieIds.length} movies?`)) {
            await removeMultipleFromWatchlist(selectedMovieIds);
            toggleSelectionMode(); // Exit selection mode
        }
    };

    const handleBulkWatched = async (watched: boolean) => {
        if (selectedMovieIds.length === 0) return;
        await markMultipleAsWatched(selectedMovieIds, watched);
        toggleSelectionMode(); // Exit selection mode
    };

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
        <div className="container mx-auto pb-40">
            <header className="mb-8 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2">
                        {isSelectionMode ? `Selected (${selectedMovieIds.length})` : 'Your Watchlist'}
                    </h1>
                    <p className="text-gray-400">
                        {isSelectionMode
                            ? 'Select movies to manage in bulk'
                            : `You have ${watchlist.length} movie${watchlist.length === 1 ? '' : 's'} saved to watch.`}
                    </p>
                </div>
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
                <AnimatePresence mode="popLayout" initial={false}>
                    {filteredMovies.map((movie) => (
                        <WatchlistItem
                            key={movie.id}
                            movie={movie}
                            isSelectionMode={isSelectionMode}
                            isSelected={selectedMovieIds.includes(movie.id)}
                            onToggleSelect={() => toggleMovieSelection(movie.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {isSelectionMode && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-4 z-50 flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-2">
                            <button
                                onClick={selectAll}
                                className="text-sm font-medium text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                {selectedMovieIds.length === filteredMovies.length ? 'Deselect All' : 'Select All'}
                            </button>
                            <span className="text-gray-500">|</span>
                            <span className="text-sm text-gray-400">
                                {selectedMovieIds.length} selected
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleBulkWatched(true)}
                                disabled={selectedMovieIds.length === 0}
                                className="p-2.5 rounded-full bg-green-900/50 text-green-400 hover:bg-green-800/50 hover:text-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Mark as Watched"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => handleBulkWatched(false)}
                                disabled={selectedMovieIds.length === 0}
                                className="p-2.5 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Mark as Unwatched"
                            >
                                <EyeOff className="w-5 h-5" />
                            </button>
                            <div className="w-[1px] h-6 bg-gray-700 mx-1" />
                            <button
                                onClick={handleBulkDelete}
                                disabled={selectedMovieIds.length === 0}
                                className="p-2.5 rounded-full bg-red-900/50 text-red-400 hover:bg-red-800/50 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                title="Delete Selected"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

