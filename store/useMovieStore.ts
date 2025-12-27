import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/lib/api';

interface MovieState {
    watchlist: Movie[];
    dismissed: string[]; // IDs of dismissed movies
    filters: FilterState;
    currentPage: number;
    addToWatchlist: (movie: Movie) => void;
    dismissMovie: (movieId: string) => void;
    removeFromWatchlist: (movieId: string) => void;
    isInWatchlist: (movieId: string) => boolean;
    isDismissed: (movieId: string) => boolean;
    setFilters: (filters: FilterState) => void;
    nextPage: () => void;
    resetPage: () => void;
}

export interface FilterState {
    genres: number[];
    yearRange: [number, number];
    minRating: number;
    sortBy: string;
    runTime: number; // Max runtime in minutes
}

export const useMovieStore = create<MovieState>()(
    persist(
        (set, get) => ({
            watchlist: [],
            dismissed: [],
            currentPage: 1,
            filters: {
                genres: [],
                yearRange: [1970, 2025],
                minRating: 0,
                sortBy: 'popularity.desc',
                runTime: 180, // Default 3 hours max
            },
            addToWatchlist: (movie) =>
                set((state) => {
                    if (state.watchlist.some((m) => m.id === movie.id)) return state;
                    return { watchlist: [...state.watchlist, movie] };
                }),
            dismissMovie: (movieId) =>
                set((state) => {
                    if (state.dismissed.includes(movieId)) return state;
                    return { dismissed: [...state.dismissed, movieId] };
                }),
            removeFromWatchlist: (movieId) =>
                set((state) => ({
                    watchlist: state.watchlist.filter((m) => m.id !== movieId),
                })),
            isInWatchlist: (movieId) => get().watchlist.some((m) => m.id === movieId),
            isDismissed: (movieId) => get().dismissed.includes(movieId),
            setFilters: (filters) => set({ filters, currentPage: 1 }),
            nextPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),
            resetPage: () => set({ currentPage: 1 }),
        }),
        {
            name: 'movie-matchmaker-storage',
        }
    )
);
