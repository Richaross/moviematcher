'use client';

import React, { useRef, useState } from 'react';
import { useMovieStore } from '@/store/useMovieStore';
import { Search, X, Check, ArrowUpDown, Clock, Star, Type } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { WatchstatusFilter, WatchlistSortKey } from '@/utils/watchlistUtils'; // Explicitly importing types for safety if available

type FilterChipProps = {
    label: string;
    active: boolean;
    onClick: () => void;
    icon?: React.ReactNode;
};

function FilterChip({ label, active, onClick, icon }: FilterChipProps) {
    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border",
                active
                    ? "bg-white text-black border-white shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    : "bg-gray-800/50 text-gray-400 border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:text-gray-200"
            )}
        >
            {icon}
            {label}
        </button>
    );
}

export default function WatchlistControls() {
    const { watchlistFilter, setWatchlistFilter } = useMovieStore();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWatchlistFilter({ search: e.target.value });
    };

    const clearSearch = () => {
        setWatchlistFilter({ search: '' });
        // Focus input after clear if desired, or leave it
        searchInputRef.current?.focus();
    };

    // Filter Helpers
    const isWatched = (val: string) => (watchlistFilter?.watched || 'all') === val;
    const isSort = (val: string) => (watchlistFilter?.sortBy || 'title') === val;

    return (
        <div className="mb-8 relative z-20">
            {/* Scrollable Container */}
            <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">

                {/* Search Input (Always Visible) */}
                <div className="relative flex items-center min-w-[200px] sm:min-w-[250px]">
                    <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-800 border-gray-700 text-white text-sm rounded-full pl-9 pr-8 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        value={watchlistFilter?.search || ''}
                        onChange={handleSearch}
                    />
                    {watchlistFilter?.search && (
                        <button
                            onClick={clearSearch}
                            className="absolute right-2 p-1 text-gray-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Vertical Divider */}
                <div className="w-[1px] h-6 bg-gray-800 shrink-0" />

                {/* Status Filters */}
                <FilterChip
                    label="All"
                    active={isWatched('all')}
                    onClick={() => setWatchlistFilter({ watched: 'all' as any })}
                />
                <FilterChip
                    label="To Watch"
                    active={isWatched('unwatched')}
                    onClick={() => setWatchlistFilter({ watched: 'unwatched' as any })}
                    icon={<Clock className="w-3.5 h-3.5" />}
                />
                <FilterChip
                    label="Watched"
                    active={isWatched('watched')}
                    onClick={() => setWatchlistFilter({ watched: 'watched' as any })}
                    icon={<Check className="w-3.5 h-3.5" />}
                />

                {/* Vertical Divider */}
                <div className="w-[1px] h-6 bg-gray-800 shrink-0" />

                {/* Sort Filters */}
                <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-1">Sort</span>

                <FilterChip
                    label="Added"
                    active={isSort('added')}
                    onClick={() => setWatchlistFilter({ sortBy: 'added' as any })}
                    icon={<ArrowUpDown className="w-3.5 h-3.5" />}
                />
                <FilterChip
                    label="Rating"
                    active={isSort('rating')}
                    onClick={() => setWatchlistFilter({ sortBy: 'rating' as any })}
                    icon={<Star className="w-3.5 h-3.5" />}
                />
                <FilterChip
                    label="A-Z"
                    active={isSort('title')}
                    onClick={() => setWatchlistFilter({ sortBy: 'title' as any })}
                    icon={<Type className="w-3.5 h-3.5" />}
                />
            </div>
        </div>
    );
}
