/**
 * @jest-environment node
 */
import { addToWatchlist } from './watchlist';
import { createClient } from '@/utils/supabase/server';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Next.js cache
vi.mock('next/cache', () => ({
    revalidatePath: vi.fn(),
}));

// Mock Supabase
vi.mock('@/utils/supabase/server', () => ({
    createClient: vi.fn(),
}));

describe('watchlist action', () => {
    const mockMovie = { id: '123', title: 'Test Movie', poster: 'path', year: 2021, rating: 8, description: 'desc', genre: [] };
    let mockSupabase: any;

    beforeEach(() => {
        // Setup chainable mock
        const postInsert = {
            select: vi.fn().mockReturnThis(),
            single: vi.fn(),
        };

        mockSupabase = {
            auth: {
                getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
            },
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn(),
            single: vi.fn(), // Required for insert().select().single() chain
            insert: vi.fn().mockReturnValue(postInsert), // Returns object with select()
        };
        (createClient as any).mockResolvedValue(mockSupabase);
    });

    it('should add a movie if it does not exist', async () => {
        // Setup existing check to return null (not found)
        mockSupabase.maybeSingle.mockResolvedValueOnce({ data: null });

        // Setup insert to succeed
        mockSupabase.insert.mockReturnThis();
        mockSupabase.select.mockReturnThis();
        mockSupabase.single.mockResolvedValueOnce({ data: { id: 'new-row-id' } }); // Return from insert

        const result = await addToWatchlist(mockMovie);
        expect(result).toBe('new-row-id');
    });

    it('should NOT add duplicate movie if quite robust', async () => {
        // This test simulates the condition we WANT:
        // logic should check existence first or handle Unique violation.

        // Let's assume we want it to check existence first.
        // First .maybeSingle() call is for the "check existence" query
        mockSupabase.maybeSingle.mockResolvedValueOnce({ data: { id: 'existing-id' } });

        const result = await addToWatchlist(mockMovie);

        // If logic is robust, it should return existing ID and NOT call insert
        expect(result).toBe('existing-id');
        expect(mockSupabase.insert).not.toHaveBeenCalled();
    });
});
