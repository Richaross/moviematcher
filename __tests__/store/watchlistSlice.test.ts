import { describe, it, expect, beforeEach } from 'vitest';
import { useMovieStore } from '../../store/useMovieStore';

// We need to mock the external dependencies to avoid side effects during store initialization
// especially since we are running in a node environment (vitest)
// The store imports actions from '@/app/actions/watchlist'.
// We should probably mock that module.

import { vi } from 'vitest';

vi.mock('@/app/actions/watchlist', () => ({
    addToWatchlist: vi.fn(),
    removeFromWatchlist: vi.fn(),
    getWatchlist: vi.fn().mockResolvedValue([]),
}));

describe('useMovieStore Watchlist Filter', () => {
    beforeEach(() => {
        useMovieStore.getState().resetStore();
    });

    it('should have initial watchlist filter state', () => {
        const state = useMovieStore.getState();
        // @ts-ignore - property doesn't exist yet
        expect(state.watchlistFilter).toBeDefined();
        // @ts-ignore
        expect(state.watchlistFilter).toEqual({
            search: '',
            watched: 'all',
            sortBy: 'title' // Default sort
        });
    });

    it('should update watchlist filter', () => {
        // @ts-ignore
        useMovieStore.getState().setWatchlistFilter({
            search: 'test',
            watched: 'watched'
        });

        const state = useMovieStore.getState();
        // @ts-ignore
        expect(state.watchlistFilter).toEqual(expect.objectContaining({
            search: 'test',
            watched: 'watched',
            sortBy: 'title' // Should preserve other keys if partial update
        }));
    });
});
