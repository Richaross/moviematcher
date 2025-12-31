import { useState } from 'react';
import { useMovieStore, FilterState } from '@/store/useMovieStore';

export function useMovieFilters() {
    const { filters, setFilters } = useMovieStore();
    const [localFilters, setLocalFilters] = useState<FilterState>(filters);

    const toggleGenre = (id: number) => {
        setLocalFilters((prev) => {
            const genres = prev.genres.includes(id)
                ? prev.genres.filter((g) => g !== id)
                : [...prev.genres, id];
            return { ...prev, genres };
        });
    };

    const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        setFilters(localFilters);
    };

    const resetFilters = () => {
        setLocalFilters({
            genres: [],
            yearRange: [1970, 2025],
            minRating: 0,
            sortBy: 'popularity.desc',
            runTime: 180,
        });
    };

    return {
        localFilters,
        toggleGenre,
        updateFilter,
        applyFilters,
        resetFilters
    };
}
