import { renderHook, waitFor } from '@testing-library/react';
import { useMovieDeck } from './useMovieDeck';
import { useMovieStore } from '@/store/useMovieStore';
import * as api from '@/lib/api';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@/store/useMovieStore');
vi.mock('@/lib/api');

describe('useMovieDeck', () => {
    const mockMovies = [
        { id: '1', title: 'Movie 1', poster: '', year: 2021, rating: 8, description: '' },
        { id: '2', title: 'Movie 2', poster: '', year: 2022, rating: 7, description: '' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (api.fetchMovies as any).mockResolvedValue(mockMovies);
        (useMovieStore as unknown as any).mockReturnValue({
            isInWatchlist: (id: string) => id === '1', // Movie 1 is in watchlist
            isDismissed: () => false,
            filters: {},
            currentPage: 1,
            addToWatchlist: vi.fn(),
            dismissMovie: vi.fn(),
            nextPage: vi.fn(),
        });
    });

    it('filters out movies that are already in the watchlist', async () => {
        const { result } = renderHook(() => useMovieDeck());

        await waitFor(() => {
            expect(result.current.isLoaded).toBe(true);
        });

        // Deck should only contain Movie 2, because Movie 1 is in watchlist
        expect(result.current.deck).toHaveLength(1);
        expect(result.current.deck[0].id).toBe('2');
    });
});
