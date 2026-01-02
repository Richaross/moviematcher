import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMovieStore } from '@/store/useMovieStore';
import { Movie } from '@/lib/api';

// Mock server actions
vi.mock('@/app/actions/watchlist', () => ({
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
    getWatchlist: vi.fn().mockResolvedValue([]),
}));

// Mock review actions - likely to be implemented in step 3
// We'll mock it now to support the store calling it if we decide to add side-effects immediately,
// but for Step 1 (Store Logic), we primarily test state updates.
vi.mock('@/app/actions/review', () => ({
    setReview: vi.fn(),
    // deleteReview?
}));

vi.mock('@/app/actions/toggleWatched', () => ({
    toggleWatched: vi.fn(),
}));

describe('useMovieStore Review Logic', () => {
    beforeEach(() => {
        useMovieStore.getState().resetStore();
        vi.clearAllMocks();
    });

    const mockMovie: Movie = {
        id: '123',
        title: 'Test Movie',
        poster: '/path',
        year: 2020,
        rating: 8.5,
        description: 'Desc',
        genre: ['Action'],
        dbId: 'db-123',
    };

    it('should set review and rating for a watchlist item', () => {
        // Setup: Add movie to watchlist
        useMovieStore.setState({ watchlist: [mockMovie] });

        // Act: Call setReview (casting as any because it doesn't exist yet)
        // @ts-ignore
        useMovieStore.getState().setReview?.('123', 'Great movie!', 9);

        // Assert
        const updatedMovie = useMovieStore.getState().watchlist.find(m => m.id === '123');
        // Note: These property accesses might need @ts-ignore until we update the type
        // @ts-ignore
        expect(updatedMovie?.review).toBe('Great movie!');
        // @ts-ignore
        expect(updatedMovie?.userRating).toBe(9); // Using userRating to distinguish from movie.rating (avg vote)
    });

    it('should clear review and rating', () => {
        // Setup: Add movie with review
        const movieWithReview = { ...mockMovie, review: 'Bad', userRating: 2 };
        // @ts-ignore
        useMovieStore.setState({ watchlist: [movieWithReview] });

        // Act
        // @ts-ignore
        useMovieStore.getState().clearReview?.('123');

        // Assert
        const updatedMovie = useMovieStore.getState().watchlist.find(m => m.id === '123');
        // @ts-ignore
        expect(updatedMovie?.review).toBeUndefined();
        // @ts-ignore
        expect(updatedMovie?.userRating).toBeUndefined();
    });
});

describe('useMovieStore - toggleWatched', () => {
    beforeEach(() => {
        useMovieStore.getState().resetStore();
        vi.clearAllMocks();
    });

    it('should toggle watched status of a movie', () => {
        const movie = {
            id: '1',
            title: 'Test Movie',
            poster: '/poster.jpg',
            year: 2023,
            rating: 8.5,
            description: 'Test overview',
            genre: ['Action'],
            watched: false,
        };

        // Initialize with one movie
        // @ts-ignore
        useMovieStore.setState({ watchlist: [movie] });

        const store = useMovieStore.getState();
        // @ts-ignore
        if (store.toggleWatched) {
            store.toggleWatched('1');
            // @ts-ignore
            const updatedMovie = useMovieStore.getState().watchlist.find((m) => m.id === '1');
            expect(updatedMovie?.watched).toBe(true);

            // Toggle back
            store.toggleWatched('1');
            // @ts-ignore
            const revertedMovie = useMovieStore.getState().watchlist.find((m) => m.id === '1');
            expect(revertedMovie?.watched).toBe(false);
        } else {
            // toggleWatched action does not exist on store
            expect(true).toBe(false);
        }
    });
});
