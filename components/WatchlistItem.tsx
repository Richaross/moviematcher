'use client';

import Image from 'next/image';
import { Star, Trash2, Calendar, MessageSquare, Edit2, Eye, EyeOff, Play, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '@/lib/api';
import { useMovieStore } from '@/store/useMovieStore';
import { useTrailer } from '@/hooks/useTrailer';
import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { cn } from '@/lib/utils';
import TrailerModal from './TrailerModal';
import { hasUserReview } from '@/utils/watchlistUtils';
import MovieDetailsModal from './MovieDetailsModal';
import { Info } from 'lucide-react'; // Import Info icon


interface WatchlistItemProps {
    movie: Movie;
    isSelectionMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
}

export function WatchlistItem({ movie, isSelectionMode = false, isSelected = false, onToggleSelect }: WatchlistItemProps) {
    const { removeFromWatchlist, setReview, toggleWatched } = useMovieStore();
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [rating, setRating] = useState(movie.userRating || 0);
    const [review, setReviewText] = useState(movie.review || '');
    const [isSaving, setIsSaving] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false); // State for modal

    // Trailer state
    const { isOpen, trailerKey, openTrailer, closeTrailer } = useTrailer();

    // Initial values when opening
    const handleOpenReview = () => {
        if (isSelectionMode) return;
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



    // Handle card click for selection
    const handleCardClick = () => {
        if (isSelectionMode && onToggleSelect) {
            onToggleSelect();
        }
    };

    const handleWatchTrailer = (e: React.MouseEvent) => {
        e.stopPropagation();
        openTrailer(movie.id);
    };

    // Check if review exists
    const hasReview = hasUserReview(movie);

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                    opacity: 1,
                    scale: isSelected ? 0.95 : 1,
                    borderColor: isSelected ? '#9333ea' : '#1f2937' // purple-600 vs gray-800
                }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={handleCardClick}
                className={cn(
                    "watchlist-card group relative flex flex-col h-full bg-gray-900 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all",
                    movie.watched && "opacity-75",
                    isSelectionMode ? "cursor-pointer" : "",
                    isSelected ? "ring-2 ring-purple-600 ring-offset-2 ring-offset-black" : "border-gray-800"
                )}
            >
                {/* Poster Image */}
                <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                        src={movie.poster}
                        alt={movie.title}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-500",
                            !isSelectionMode && "group-hover:scale-105",
                            movie.watched && "grayscale"
                        )}
                    />

                    {/* Selection Overlay */}
                    {isSelectionMode && (
                        <div className={cn(
                            "absolute inset-0 bg-black/40 transition-opacity flex items-center justify-center",
                            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        )}>
                            <div className={cn(
                                "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all scale-0",
                                isSelected ? "bg-purple-600 border-purple-600 scale-100" : "border-white/50 scale-100"
                            )}>
                                {isSelected && <Check className="w-8 h-8 text-white" />}
                            </div>
                        </div>
                    )}

                    {/* Overlay Actions (Only when NOT in selection mode) */}
                    {!isSelectionMode && (
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

                            {/* Info Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsInfoOpen(true); }}
                                className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg delay-75 backdrop-blur-md"
                                title="View Details"
                            >
                                <Info className="w-5 h-5" />
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
                    )}

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
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
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

                    {/* Expanded Details: Overview */}
                    <p className="text-xs text-gray-400 line-clamp-3 mb-3 leading-relaxed">
                        {movie.description}
                    </p>

                    {/* Watch Trailer Button */}
                    {!isReviewOpen && !isSelectionMode && (
                        <button
                            onClick={handleWatchTrailer}
                            className="w-full mt-auto mb-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs py-2 rounded flex items-center justify-center gap-2 transition-colors group-hover:border-white/20"
                        >
                            <Play className="w-3 h-3 fill-current" />
                            Watch Trailer
                        </button>
                    )}

                    {/* User Review Summary (if closed) */}
                    {!isReviewOpen && hasReview && (
                        <div className="pt-3 border-t border-gray-800 animate-in fade-in slide-in-from-top-1 duration-300">
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

            <TrailerModal
                isOpen={isOpen}
                onClose={closeTrailer}
                videoKey={trailerKey}
            />


            <MovieDetailsModal
                movie={movie}
                isOpen={isInfoOpen}
                onClose={() => setIsInfoOpen(false)}
            />
        </>
    );
}
