'use client';

import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMovieFilters } from '@/hooks/useMovieFilters';
import GenreFilter from './filters/GenreFilter';
import RatingFilter from './filters/RatingFilter';
import YearFilter from './filters/YearFilter';
import SortFilter from './filters/SortFilter';
import RuntimeFilter from './filters/RuntimeFilter';

interface MovieFiltersProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MovieFilters({ isOpen, onClose }: MovieFiltersProps) {
    const {
        localFilters,
        updateFilter,
        applyFilters,
        resetFilters
    } = useMovieFilters();

    const handleApply = () => {
        applyFilters();
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-900 border-l border-gray-800 z-[300] overflow-y-auto"
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

                            <GenreFilter
                                selectedGenres={localFilters.genres}
                                onChange={(genres) => updateFilter('genres', genres)}
                            />

                            <RatingFilter
                                minRating={localFilters.minRating}
                                onChange={(rating) => updateFilter('minRating', rating)}
                            />

                            <YearFilter
                                yearRange={localFilters.yearRange}
                                onChange={(range) => updateFilter('yearRange', range)}
                            />

                            <SortFilter
                                sortBy={localFilters.sortBy}
                                onChange={(sort) => updateFilter('sortBy', sort)}
                            />

                            <RuntimeFilter
                                runTime={localFilters.runTime}
                                onChange={(runtime) => updateFilter('runTime', runtime)}
                            />

                            {/* Actions */}
                            <div className="flex gap-4 pt-4 border-t border-gray-800">
                                <button
                                    onClick={resetFilters}
                                    className="flex-1 py-3 px-4 rounded-xl font-medium text-gray-400 hover:bg-gray-800 transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={handleApply}
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
