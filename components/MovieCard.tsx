'use client';

import { motion } from 'framer-motion';
import { Movie } from '@/lib/api';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { clsx } from 'clsx';
import TrailerModal from './TrailerModal';
import MovieCardContent from './MovieCard/MovieCardContent';
import MovieCardOverlay from './MovieCard/MovieCardOverlay';
import { useTrailer } from '@/hooks/useTrailer';
import { useCardMotion } from '@/hooks/useCardMotion';
import { memo } from 'react';

interface MovieCardProps {
    movie: Movie;
    onSwipe: (direction: 'left' | 'right') => void;
    index: number;
}

function MovieCard({ movie, onSwipe, index }: MovieCardProps) {
    const { isOpen, trailerKey, openTrailer, closeTrailer } = useTrailer();
    const {
        x,
        rotate,
        exitX,
        yepOpacity,
        nopeOpacity,
        handleDragEnd
    } = useCardMotion({ onSwipe, index });

    const handleWatchTrailer = async (e: React.MouseEvent) => {
        e.stopPropagation();
        openTrailer(movie.id);
    };

    const isFront = index === 0;

    return (
        <motion.div
            style={{
                x,
                rotate,
                zIndex: 100 - index,
                scale: isFront ? 1 : 0.95,
                opacity: index > 1 ? 0 : 1, // Only show top 2
            }}
            animate={{
                scale: isFront ? 1 : 0.95,
                x: exitX ?? 0,
                opacity: index > 1 ? 0 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            drag={isFront ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className={clsx(
                'card-container',
                !isFront && 'pointer-events-none'
            )}
        >
            {/* Background Image */}
            <div className="absolute inset-0 select-none pointer-events-none">
                <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>

            {/* Swipe Overlay Indicators */}
            <MovieCardOverlay yepOpacity={yepOpacity} nopeOpacity={nopeOpacity} />

            {/* Watch Trailer Button - Top Right */}
            <button
                onClick={handleWatchTrailer}
                className="absolute top-4 right-4 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all z-30 hover:scale-110 active:scale-95 border border-white/10"
                title="Watch Trailer"
            >
                <Play className="w-6 h-6 fill-white" />
            </button>

            {/* Content */}
            <MovieCardContent movie={movie} />

            <TrailerModal
                isOpen={isOpen}
                onClose={closeTrailer}
                videoKey={trailerKey}
            />
        </motion.div >
    );
}

export default memo(MovieCard);
