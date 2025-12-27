'use client';

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Movie } from '@/lib/api';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';

interface MovieCardProps {
    movie: Movie;
    onSwipe: (direction: 'left' | 'right') => void;
    index: number;
}

export default function MovieCard({ movie, onSwipe, index }: MovieCardProps) {
    const [exitX, setExitX] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Color overlays
    const yepOpacity = useTransform(x, [0, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        if (info.offset.x > 100) {
            setExitX(2000);
            onSwipe('right');
        } else if (info.offset.x < -100) {
            setExitX(-2000);
            onSwipe('left');
        }
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
            <motion.div
                style={{ opacity: yepOpacity }}
                className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg] z-20 pointer-events-none"
            >
                <span className="text-4xl font-black text-green-500 uppercase tracking-widest">
                    LIKE
                </span>
            </motion.div>

            <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg] z-20 pointer-events-none"
            >
                <span className="text-4xl font-black text-red-500 uppercase tracking-widest">
                    NOPE
                </span>
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10 select-none">
                <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-md">
                        {movie.title}
                    </h2>
                    <span className="text-xl font-medium text-gray-300 ml-2">
                        {movie.year}
                    </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    <div className="badge-rating">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{movie.rating.toFixed(1)}</span>
                    </div>
                    {movie.genre.slice(0, 2).map((g) => (
                        <span
                            key={g}
                            className="badge-genre"
                        >
                            {g}
                        </span>
                    ))}
                </div>

                <motion.div
                    initial={false}
                    animate={{ height: isExpanded ? 'auto' : '4.5rem' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="relative overflow-hidden cursor-pointer"
                    onHoverStart={() => setIsExpanded(true)}
                    onHoverEnd={() => setIsExpanded(false)}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <p className="text-gray-300 text-sm leading-relaxed drop-shadow-sm transition-colors duration-300 hover:text-white">
                        {movie.description}
                    </p>
                    <motion.div
                        animate={{ opacity: isExpanded ? 0 : 1 }}
                        className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-900 to-transparent"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
