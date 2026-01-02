import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WatchlistControls from '../../components/WatchlistControls';
import { useMovieStore } from '../../store/useMovieStore';

// Mock the store hook
vi.mock('../../store/useMovieStore', () => ({
    useMovieStore: vi.fn(),
}));

describe('WatchlistControls', () => {
    const setWatchlistFilter = vi.fn();
    const mockFilter = {
        search: '',
        watched: 'all',
        sortBy: 'title',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementation
        (useMovieStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
            watchlistFilter: mockFilter,
            setWatchlistFilter,
        });
    });

    it('renders search input and chip buttons', () => {
        render(<WatchlistControls />);

        // Search input should be visible immediately
        expect(screen.getByPlaceholderText('Search...')).toBeDefined();

        // Check for specific chip labels
        expect(screen.getByText('All')).toBeDefined();
        expect(screen.getByText('To Watch')).toBeDefined();
        expect(screen.getByText('Watched')).toBeDefined();
        expect(screen.getByText('A-Z')).toBeDefined();
    });

    it('updates search query on input', () => {
        render(<WatchlistControls />);

        const input = screen.getByPlaceholderText('Search...');
        fireEvent.change(input, { target: { value: 'matrix' } });

        expect(setWatchlistFilter).toHaveBeenCalledWith({ search: 'matrix' });
    });

    it('updates filter on chip click', () => {
        render(<WatchlistControls />);

        const watchedChip = screen.getByText('Watched');
        fireEvent.click(watchedChip);

        expect(setWatchlistFilter).toHaveBeenCalledWith({ watched: 'watched' });
    });

    it('updates sort on chip click', () => {
        render(<WatchlistControls />);

        const ratingChip = screen.getByText('Rating');
        fireEvent.click(ratingChip);

        expect(setWatchlistFilter).toHaveBeenCalledWith({ sortBy: 'rating' });
    });
});
