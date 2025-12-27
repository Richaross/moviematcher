'use client';

import { useMovieStore } from '@/store/useMovieStore';
import Image from 'next/image';
import { Star, Trash2, Calendar, Film } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WatchlistPage() {
    const { watchlist, removeFromWatchlist } = useMovieStore();

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
        <div className="container mx-auto">
            <header className="mb-10 text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2">Your Watchlist</h1>
                <p className="text-gray-400">
                    You have {watchlist.length} movie{watchlist.length === 1 ? '' : 's'} saved to watch.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
                <AnimatePresence>
                    {watchlist.map((movie) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                            className="watchlist-card group"
                        >
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <Image
                                    src={movie.poster}
                                    alt={movie.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <button
                                        onClick={() => removeFromWatchlist(movie.id)}
                                        className="btn-icon-overlay"
                                        title="Remove from watchlist"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 leading-snug truncate" title={movie.title}>
                                    {movie.title}
                                </h3>
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{movie.year}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-3 h-3 fill-current" />
                                        <span>{movie.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {movie.genre.slice(0, 2).map(g => (
                                        <span key={g} className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
