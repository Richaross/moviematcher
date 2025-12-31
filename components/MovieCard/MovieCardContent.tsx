import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Movie } from '@/lib/api';
import { useState } from 'react';

interface MovieCardContentProps {
    movie: Movie;
}

export default function MovieCardContent({ movie }: MovieCardContentProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10 select-none">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl font-bold text-white leading-tight drop-shadow-md">
                        {movie.title}
                    </h2>
                    <span className="text-xl font-medium text-gray-300">
                        {movie.year}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <div className="badge-rating">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{movie.rating.toFixed(1)}</span>
                </div>
                {movie.genre.slice(0, 2).map((g) => (
                    <span key={g} className="badge-genre">
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
    );
}
