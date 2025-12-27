'use client';

import { useMovieStore } from '@/store/useMovieStore';
import { GENRES } from '@/lib/api';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { clsx } from 'clsx';

interface MovieFiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MovieFilters({ isOpen, onClose }: MovieFiltersProps) {
    const { filters, setFilters } = useMovieStore();
    const [localFilters, setLocalFilters] = useState(filters);

    const toggleGenre = (id: number) => {
        setLocalFilters((prev) => {
            const genres = prev.genres.includes(id)
                ? prev.genres.filter((g) => g !== id)
                : [...prev.genres, id];
            return { ...prev, genres };
        });
    };

    const applyFilters = () => {
        setFilters(localFilters);
        onClose();
    };

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 border-l border-gray-800 z-[200] overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold">Filters</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Genres */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                                    Genres
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(GENRES).map(([id, name]) => {
                                        const genreId = parseInt(id);
                                        const isSelected = localFilters.genres.includes(genreId);
                                        return (
                                            <button
                                                key={id}
                                                onClick={() => toggleGenre(genreId)}
                                                className={clsx(
                                                    'btn-filter-option',
                                                    isSelected
                                                        ? 'btn-filter-option-active'
                                                        : 'btn-filter-option-inactive'
                                                )}
                                            >
                                                {name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Min Rating */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                                    Minimum Rating: {localFilters.minRating}
                                </h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    step="0.5"
                                    value={localFilters.minRating}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            minRating: parseFloat(e.target.value),
                                        })
                                    }
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>0</span>
                                    <span>5</span>
                                    <span>10</span>
                                </div>
                            </div>

                            {/* Year Range */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                                    Year: {localFilters.yearRange[0]} -{' '}
                                    {localFilters.yearRange[1]}
                                </h3>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 mb-1 block">
                                            From
                                        </label>
                                        <input
                                            type="number"
                                            min="1900"
                                            max="2025"
                                            value={localFilters.yearRange[0]}
                                            onChange={(e) =>
                                                setLocalFilters({
                                                    ...localFilters,
                                                    yearRange: [
                                                        parseInt(e.target.value),
                                                        localFilters.yearRange[1],
                                                    ],
                                                })
                                            }
                                            className="input-field"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs text-gray-500 mb-1 block">
                                            To
                                        </label>
                                        <input
                                            type="number"
                                            min="1900"
                                            max="2025"
                                            value={localFilters.yearRange[1]}
                                            onChange={(e) =>
                                                setLocalFilters({
                                                    ...localFilters,
                                                    yearRange: [
                                                        localFilters.yearRange[0],
                                                        parseInt(e.target.value),
                                                    ],
                                                })
                                            }
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sort By */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                                    Sort By
                                </h3>
                                <select
                                    value={localFilters.sortBy}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            sortBy: e.target.value,
                                        })
                                    }
                                    className="input-field appearance-none"
                                >
                                    <option value="popularity.desc">Most Popular</option>
                                    <option value="vote_average.desc">Highest Rated</option>
                                    <option value="primary_release_date.desc">Newest Releases</option>
                                    <option value="revenue.desc">Highest Revenue</option>
                                </select>
                            </div>

                            {/* Runtime */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold mb-4 text-gray-200">
                                    Max Duration: {localFilters.runTime} min
                                </h3>
                                <input
                                    type="range"
                                    min="60"
                                    max="240"
                                    step="15"
                                    value={localFilters.runTime}
                                    onChange={(e) =>
                                        setLocalFilters({
                                            ...localFilters,
                                            runTime: parseInt(e.target.value),
                                        })
                                    }
                                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-2">
                                    <span>60m</span>
                                    <span>120m</span>
                                    <span>180m</span>
                                    <span>240m</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-800">
                                <button
                                    onClick={() =>
                                        setLocalFilters({
                                            genres: [],
                                            yearRange: [1970, 2025],
                                            minRating: 0,
                                            sortBy: 'popularity.desc',
                                            runTime: 180,
                                        })
                                    }
                                    className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-400 hover:bg-gray-800 transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={applyFilters}
                                    className="flex-[2] py-3 px-4 rounded-xl font-bold bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Check className="w-5 h-5" />
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
