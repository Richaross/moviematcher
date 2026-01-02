import { describe, it, expect, vi } from 'vitest';
import { deduplicateMovies, filterDeckMovies } from './movieUtils';
import { Movie } from '@/lib/api';

describe('movieUtils', () => {
    const mockMovies: Movie[] = [
        { id: '1', title: 'Movie A', poster: 'p1', year: 2020, rating: 8, overview: '' },
        { id: '2', title: 'Movie B', poster: 'p2', year: 2021, rating: 9, overview: '' },
        { id: '1', title: 'Movie A (Duplicate)', poster: 'p1', year: 2020, rating: 8, overview: '' },
    ];

    describe('deduplicateMovies', () => {
        it('removes duplicates based on ID, keeping the last one', () => {
            const unique = deduplicateMovies(mockMovies);
            expect(unique).toHaveLength(2);
            expect(unique.find(m => m.id === '1')?.title).toBe('Movie A (Duplicate)');
        });

        it('handles empty arrays', () => {
            expect(deduplicateMovies([])).toEqual([]);
        });
    });

    describe('filterDeckMovies', () => {
        it('excludes movies in watchlist or dismissed list', () => {
            const isInWatchlist = (id: string) => id === '1';
            const isDismissed = (id: string) => false;

            const filtered = filterDeckMovies(mockMovies, isInWatchlist, isDismissed);
            // Movie 1 is in watchlist -> excluded
            // Movie 2 is safe -> included
            // Movie 1 (Duplicate) -> excluded
            expect(filtered).toHaveLength(1);
            expect(filtered[0].id).toBe('2');
        });
    });
});
