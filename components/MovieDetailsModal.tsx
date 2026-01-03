'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Star, Play } from 'lucide-react';
import Image from 'next/image';
import { Movie } from '@/lib/api';
import { useTrailer } from '@/hooks/useTrailer';
import TrailerModal from './TrailerModal';

interface MovieDetailsModalProps {
    movie: Movie | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function MovieDetailsModal({ movie, isOpen, onClose }: MovieDetailsModalProps) {
    const { isOpen: isTrailerOpen, trailerKey, openTrailer, closeTrailer } = useTrailer();

    if (!movie) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-black/20 p-2 rounded-full backdrop-blur-md"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Hero Image */}
                            <div className="relative h-64 w-full">
                                <Image
                                    src={movie.poster}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                                <div className="absolute bottom-0 left-0 p-6 w-full">
                                    <h2 className="text-3xl font-bold text-white mb-2 leading-tight">{movie.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-300">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            <span>{movie.year}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span>{movie.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 pt-2">
                                {/* Genres */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {movie.genre && movie.genre.map((g) => (
                                        <span key={g} className="text-xs font-medium px-2.5 py-1 rounded bg-white/10 text-gray-300 border border-white/5">
                                            {g}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                                    {movie.description}
                                </p>

                                <button
                                    onClick={() => openTrailer(movie.id)}
                                    className="w-full py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    Watch Trailer
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>

                    <TrailerModal
                        isOpen={isTrailerOpen}
                        onClose={closeTrailer}
                        videoKey={trailerKey}
                    />
                </>
            )}
        </AnimatePresence>
    );
}
