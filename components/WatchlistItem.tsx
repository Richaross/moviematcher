'use client';

import Image from 'next/image';
import { Star, Trash2, Calendar, MessageSquare, Edit2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '@/lib/api';
import { useMovieStore } from '@/store/useMovieStore';
import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { cn } from '@/lib/utils';

interface WatchlistItemProps {
    movie: Movie;
}

export function WatchlistItem({ movie }: WatchlistItemProps) {
    const { removeFromWatchlist, setReview, toggleWatched } = useMovieStore();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [rating, setRating] = useState(movie.userRating || 0);
    const [review, setReviewText] = useState(movie.review || '');
    const [isSaving, setIsSaving] = useState(false);

    // Initial values when opening
    const handleOpenReview = () => {
        setRating(movie.userRating || 0);
        setReviewText(movie.review || '');
        setIsReviewOpen(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setReview(movie.id, review, rating);
            setIsReviewOpen(false);
        } catch (error) {
            console.error("Failed to save review", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsReviewOpen(false);
        // Reset to store values
        setRating(movie.userRating || 0);
        setReviewText(movie.review || '');
    };

    // Check if review exists
    const hasReview = (movie.review && movie.review.length > 0) || (movie.userRating !== undefined && movie.userRating > 0);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
                "watchlist-card group relative flex flex-col h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                movie.watched && "opacity-75"
            )}
        >
            {/* Poster Image */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className={cn(
                        "object-cover group-hover:scale-105 transition-transform duration-500",
                        movie.watched && "grayscale"
                    )}
                />

                {/* Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10 p-4">
                    {/* Watched Toggle */}
                    <button
                        onClick={(e) => { e.stopPropagation(); toggleWatched(movie.id); }}
                        className={cn(
                            "p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg",
                            movie.watched
                                ? "bg-green-600 hover:bg-green-500 text-white"
                                : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md"
                        )}
                        title={movie.watched ? "Mark as unwatched" : "Mark as watched"}
                    >
                        {movie.watched ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>

                    {/* Review Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); handleOpenReview(); }}
                        className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg backdrop-blur-md"
                        title={hasReview ? "Edit Review" : "Add Review"}
                    >
                        {hasReview ? <Edit2 className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
                    </button>

                    {/* Remove Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); removeFromWatchlist(movie.id); }}
                        className="bg-red-600/90 hover:bg-red-500 text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg"
                        title="Remove from watchlist"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Watched Badge */}
                {movie.watched && (
                    <div className="absolute top-2 right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg z-20 pointer-events-none">
                        <Eye className="w-3 h-3" />
                        WATCHED
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1 leading-snug truncate" title={movie.title}>
                    {movie.title}
                </h3>

                {/* Meta Row */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{movie.year}</span>
                    </div>
                    {/* TMDB Rating */}
                    <div className="flex items-center gap-1 text-yellow-500/80" title="TMDB Rating">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{movie.rating.toFixed(1)}</span>
                    </div>
                </div>

                {/* User Review Summary (if closed) */}
                {!isReviewOpen && hasReview && (
                    <div className="mt-auto pt-3 border-t border-gray-800 animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Your Rating</span>
                            <RatingStars rating={movie.userRating || 0} readOnly size="sm" />
                        </div>
                        {movie.review && (
                            <p className="text-sm text-gray-300 italic line-clamp-2 leading-relaxed">
                                "{movie.review}"
                            </p>
                        )}
                    </div>
                )}

                {/* Genres (if no review shown) */}
                {!isReviewOpen && !hasReview && (
                    <div className="mt-auto pt-2 flex flex-wrap gap-1">
                        {movie.genre && movie.genre.slice(0, 2).map(g => (
                            <span key={g} className="text-[10px] uppercase tracking-wider bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5">
                                {g}
                            </span>
                        ))}
                    </div>
                )}

                {/* Review Form (Expandable) */}
                <AnimatePresence>
                    {isReviewOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 border-t border-gray-800">
                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Your Rating</label>
                                    <RatingStars rating={rating} onChange={setRating} />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-xs font-medium text-gray-400 mb-1">Review</label>
                                    <textarea
                                        className="w-full bg-black/20 border border-gray-700 rounded p-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500/50 resize-none transition-colors"
                                        rows={3}
                                        placeholder="What did you think?"
                                        value={review}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="flex items-center gap-2 justify-end">
                                    <button
                                        onClick={handleCancel}
                                        className="text-xs text-gray-400 hover:text-white px-3 py-1.5 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded font-medium flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? 'Saving...' : 'Save Review'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
