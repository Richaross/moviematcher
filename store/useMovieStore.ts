import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/lib/api';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '@/app/actions/watchlist';
import { toggleWatched as toggleWatchedAction } from '@/app/actions/toggleWatched'; // Preserving this import seen in logs
import { WatchlistFilter, DEFAULT_WATCHLIST_FILTER } from '@/utils/watchlistUtils';
import { deduplicateMovies } from '@/utils/movieUtils';

// --- Types ---

export interface FilterState {
    genres: number[];
    yearRange: [number, number];
    minRating: number;
    sortBy: string;
    runTime: number;
}

interface MovieState {
    // Data
    watchlist: Movie[];
    dismissed: string[];
    filters: FilterState; // Discover filters
    watchlistFilter: WatchlistFilter; // Watchlist filters
    currentPage: number;
    userId: string | null;

    // Selection State
    isSelectionMode: boolean;
    selectedMovieIds: string[];

    // Async Actions (Side Effects)
    fetchWatchlist: () => Promise<void>;
    addToWatchlist: (movie: Movie) => Promise<void>;
    removeFromWatchlist: (movieId: string) => Promise<void>;
    toggleWatched: (movieId: string) => Promise<void>;
    setReview: (movieId: string, review: string, rating: number) => Promise<void>;
    clearReview: (movieId: string) => Promise<void>;
    removeMultipleFromWatchlist: (movieIds: string[]) => Promise<void>;
    markMultipleAsWatched: (movieIds: string[], watched: boolean) => Promise<void>;

    // Sync Actions (UI State)
    initializeForUser: (userId: string) => void;
    dismissMovie: (movieId: string) => void;
    isInWatchlist: (movieId: string) => boolean;
    isDismissed: (movieId: string) => boolean;
    setFilters: (filters: FilterState) => void;
    setWatchlistFilter: (filter: Partial<WatchlistFilter>) => void;

    // Selection Actions
    toggleSelectionMode: () => void;
    toggleMovieSelection: (id: string) => void;
    selectAll: () => void;
    clearSelection: () => void;

    nextPage: () => void;
    resetPage: () => void;
    resetStore: () => void;
}

// --- Store Implementation ---

export const useMovieStore = create<MovieState>()(
    persist(
        (set, get) => ({
            // Initial State
            watchlist: [],
            dismissed: [],
            currentPage: 1,
            userId: null,
            filters: {
                genres: [],
                yearRange: [1900, new Date().getFullYear()],
                minRating: 0,
                sortBy: 'popularity.desc',
                runTime: 180,
            },
            watchlistFilter: { ...DEFAULT_WATCHLIST_FILTER },
            isSelectionMode: false,
            selectedMovieIds: [],

            // --- Async Actions ---

            fetchWatchlist: async () => {
                try {
                    const movies = await getWatchlist();
                    const uniqueMovies = deduplicateMovies(movies);
                    set({ watchlist: uniqueMovies });
                } catch (error) {
                    console.error('Failed to fetch watchlist:', error);
                }
            },

            addToWatchlist: async (movie) => {
                // 1. Optimistic Update
                const previousWatchlist = get().watchlist;
                const exists = previousWatchlist.some((m) => m.id === movie.id);
                if (exists) return;

                set((state) => ({ watchlist: [...state.watchlist, movie] }));

                // 2. DB Sync
                try {
                    const dbId = await addToWatchlist(movie);
                    // Update the local item with the real DB ID
                    set((state) => ({
                        watchlist: state.watchlist.map(m =>
                            m.id === movie.id ? { ...m, dbId } : m
                        )
                    }));
                } catch (error) {
                    console.error('Failed to save to watchlist:', error);
                    // 3. Rollback on failure
                    set({ watchlist: previousWatchlist });
                }
            },

            removeFromWatchlist: async (movieId) => {
                const movieToRemove = get().watchlist.find(m => m.id === movieId);
                if (!movieToRemove?.dbId) {
                    console.warn('Attempted to remove movie without DB ID, likely not fully synced yet.');
                    return;
                }

                // 1. Optimistic Update
                const previousWatchlist = get().watchlist;
                set((state) => ({
                    watchlist: state.watchlist.filter((m) => m.id !== movieId)
                }));

                // 2. DB Sync
                try {
                    await removeFromWatchlist(movieToRemove.dbId);
                } catch (error) {
                    console.error('Failed to remove from watchlist:', error);
                    // 3. Rollback
                    set({ watchlist: previousWatchlist });
                }
            },

            toggleWatched: async (movieId) => {
                const movie = get().watchlist.find(m => m.id === movieId);
                if (!movie) return;

                const originalWatched = movie.watched || false;
                const newWatched = !originalWatched;

                // 1. Optimistic Update
                set((state) => ({
                    watchlist: state.watchlist.map((m) =>
                        m.id === movieId ? { ...m, watched: newWatched } : m
                    ),
                }));

                // 2. DB Sync
                try {
                    if (movie.dbId) {
                        await toggleWatchedAction(movie.dbId, newWatched);
                    }
                } catch (error) {
                    console.error('Failed to toggle watched status:', error);
                    // 3. Rollback
                    set((state) => ({
                        watchlist: state.watchlist.map((m) =>
                            m.id === movieId ? { ...m, watched: originalWatched } : m
                        ),
                    }));
                }
            },

            setReview: async (movieId, review, rating) => {
                // 1. Optimistic Update
                const previousWatchlist = get().watchlist;
                set((state) => ({
                    watchlist: state.watchlist.map((m) =>
                        m.id === movieId ? { ...m, review, userRating: rating } : m
                    )
                }));

                // 2. DB Sync
                try {
                    const { setReview } = await import('@/app/actions/review');
                    await setReview(movieId, review, rating);
                } catch (error) {
                    console.error('Failed to save review:', error);
                    // 3. Rollback
                    set({ watchlist: previousWatchlist });
                }
            },

            clearReview: async (movieId) => {
                // 1. Optimistic Update
                const previousWatchlist = get().watchlist;
                set((state) => ({
                    watchlist: state.watchlist.map((m) => {
                        if (m.id === movieId) {
                            const { review, userRating, ...rest } = m;
                            return rest;
                        }
                        return m;
                    })
                }));

                // 2. DB Sync
                try {
                    const { setReview } = await import('@/app/actions/review');
                    await setReview(movieId, '', 0);
                } catch (error) {
                    console.error('Failed to clear review:', error);
                    set({ watchlist: previousWatchlist });
                }
            },


            removeMultipleFromWatchlist: async (movieIds) => {
                // 1. Optimistic Update
                const previousWatchlist = get().watchlist;
                set((state) => ({
                    watchlist: state.watchlist.filter((m) => !movieIds.includes(m.id))
                }));

                // 2. DB Sync
                try {
                    // Filter out movies that don't have a DB ID yet (optimistic only)
                    const moviesToRemove = previousWatchlist.filter(m => movieIds.includes(m.id) && m.dbId);
                    const dbIds = moviesToRemove.map(m => m.dbId as string);

                    if (dbIds.length > 0) {
                        // We'll need a specialized server action for bulk delete to be efficient,
                        // but for now, we can loop (or better, add a bulk action later).
                        // Let's iterate for MVP compliance with existing actions.
                        // Ideally, we should implement a `removeMultiple` server action.
                        // For this iteration, I will use `Promise.all` with existing single-item action.
                        await Promise.all(dbIds.map(id => removeFromWatchlist(id)));
                    }
                } catch (error) {
                    console.error('Failed to bulk remove:', error);
                    // 3. Rollback
                    set({ watchlist: previousWatchlist });
                }
            },

            markMultipleAsWatched: async (movieIds, watched) => {
                // 1. Optimistic Update
                const previousWatchlist = get().watchlist;
                set((state) => ({
                    watchlist: state.watchlist.map(m =>
                        movieIds.includes(m.id) ? { ...m, watched } : m
                    )
                }));

                // 2. DB Sync
                try {
                    const moviesToUpdate = previousWatchlist.filter(m => movieIds.includes(m.id) && m.dbId);

                    await Promise.all(moviesToUpdate.map(m =>
                        toggleWatchedAction(m.dbId!, watched)
                    ));

                } catch (error) {
                    console.error('Failed to bulk update watched status:', error);
                    set({ watchlist: previousWatchlist });
                }
            },


            // --- Sync Actions ---

            initializeForUser: (userId: string) => {
                const currentUserId = get().userId;
                if (currentUserId !== userId) {
                    // Reset user-specific state when switching users
                    set({
                        userId: userId,
                        watchlist: [],
                        currentPage: 1
                    });
                }
            },

            dismissMovie: (movieId) =>
                set((state) => {
                    if (state.dismissed.includes(movieId)) return state;
                    return { dismissed: [...state.dismissed, movieId] };
                }),

            isInWatchlist: (movieId) => get().watchlist.some((m) => String(m.id) === String(movieId)),

            isDismissed: (movieId) => get().dismissed.includes(movieId),

            setFilters: (filters) => set({ filters, currentPage: 1 }),

            setWatchlistFilter: (filter) =>
                set((state) => ({
                    watchlistFilter: { ...state.watchlistFilter, ...filter }
                })),

            // Selection Actions
            toggleSelectionMode: () => set((state) => ({
                isSelectionMode: !state.isSelectionMode,
                selectedMovieIds: [] // Clear selection when toggling off/on
            })),

            toggleMovieSelection: (id) => set((state) => {
                const isSelected = state.selectedMovieIds.includes(id);
                return {
                    selectedMovieIds: isSelected
                        ? state.selectedMovieIds.filter(mid => mid !== id)
                        : [...state.selectedMovieIds, id]
                };
            }),

            selectAll: () => set((state) => ({
                selectedMovieIds: state.watchlist.map(m => m.id)
            })),

            clearSelection: () => set({ selectedMovieIds: [] }),

            nextPage: () => set((state) => ({ currentPage: state.currentPage + 1 })),

            resetPage: () => set({ currentPage: 1 }),

            resetStore: () => set({
                watchlist: [],
                dismissed: [],
                currentPage: 1,
                userId: null,
                watchlistFilter: { ...DEFAULT_WATCHLIST_FILTER }
            }),
        }),
        {
            name: 'movie-matchmaker-storage-v5', // Increment version
            partialize: (state) => ({
                dismissed: state.dismissed,
                filters: state.filters,
                watchlistFilter: state.watchlistFilter,
            }),
        }
    )
);

