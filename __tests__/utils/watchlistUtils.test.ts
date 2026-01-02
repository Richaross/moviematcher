import { describe, it, expect } from 'vitest';
import { filterWatchlist, sortWatchlist } from '../../utils/watchlistUtils';
import { Movie } from '../../lib/api';

// Mock data
const mockMovies: Movie[] = [
    {
        id: '1',
        title: 'A Movie',
        poster: 'poster1.jpg',
        year: 2020,
        genre: ['Action'],
        rating: 8.5,
        description: 'Desc 1',
        dbId: 'db1',
    },
    {
        id: '2',
        title: 'B Movie',
        poster: 'poster2.jpg',
        year: 2021,
        genre: ['Drama'],
        rating: 6.0,
        description: 'Desc 2',
        // dbId missing means not sync'd -> effectively local only, but for "watched" logic we need to define how we track it.
        // Wait, the requirement says "Filter by Watched". 
        // The current `Movie` interface DOES NOT have a `watched` property.
        // I need to check `useMovieStore` again or `lib/api`.
    },
    {
        id: '3',
        title: 'C Movie',
        poster: 'poster3.jpg',
        year: 2019,
        genre: ['Comedy'],
        rating: 9.0,
        description: 'Desc 3',
        dbId: 'db3',
    },
];

// Let's assume for now that "watched" status will be passed in or part of the movie object? 
// Checking `useMovieStore.ts`, `watchlist` is an array of `Movie`.
// The `Movie` interface in `lib/api.ts` does NOT have a `watched` boolean.
// I probably need to check if there's a separate "watched" list or if I need to extend the type.
// The prompt said: "Allow users to filter (by watched status)".
// In many apps, "watchlist" implies "to watch". "Watched" might mean "history".
// However, the `useMovieStore` has `dismissed` array.
// Maybe "watched" is a new field I need to add?
// Or maybe it refers to `seen` movies?
// The prompt says: "Allow users to filter (by watched status) ... their watchlist".
// Usually items in a watchlist are unwatched.
// If I can mark them as watched, I need a place to store that.
// The `implementation_plan` mentions `filterWatchlist(items, filters)`.
// `filters.watched` is `'all' | 'watched' | 'unwatched'`.
// This implies the `Movie` object OR the store needs to know if a movie is watched.
// Existing `Movie` interface:
// export interface Movie { id, dbId, title, poster, year, genre, rating, description }
//
// I might need to extend the Mock for the test to include `watched` if I'm going to add it to the type, 
// OR pass a separate list of watched IDs.
// Given strict instructions "Only touch your specific slice of state (`watchlistFilter`)", 
// and "Do NOT modify the `watchlist` array structure itself (that's shared)", 
// AND "Agent 1 & 3 are modifying `store/useMovieStore.ts`",
// modifying `Movie` type might be risky if it breaks their code.
// BUT, if I can't store "watched" status, I can't filter by it.
//
// Let's look at `agent_2_watchlist_filtering.md` again.
// "Non-Goals: Don't implement the review UI or watched toggles".
// "Don't change how movies are added/removed from watchlist".
//
// If there is no "watched" property on `Movie`, and I'm not supposed to add "watched toggles",
// then maybe "watched" status comes from somewhere else?
// Or maybe I am supposed to assume a `watched` boolean exists or will exist?
//
// Wait, if I can't implement the toggle, how does a movie BECOME watched?
// Maybe Agent 1 or 3 is doing that?
// "Agent 1 & 3 are modifying store...".
//
// I will assume for the purpose of the UTILITY that the `Movie` objects passed to it MIGHT have a `watched` property,
// OR that I pass a set of watched IDs.
// Passing a set of watched IDs `filterWatchlist(items, watchedIds, filters)` is safer and pure.
// But `filterWatchlist(items, filters)` was the signature.
//
// Let's check `lib/api.ts` again. `Movie` has no `watched`.
//
// Implementation Decision:
// I will define an extended interface `WatchlistMovie extends Movie { watched?: boolean }` for the utility,
// OR I will assume the `Movie` interface WILL change.
// But I can't change `lib/api.ts` safely without conflict?
//
// actually, I should probably check if I can modify `lib/api.ts` or if I should just use intersection type in my utility.
// `type WatchlistMovie = Movie & { watched?: boolean };`
//
// Let's try to stick to the plan.
// `filterWatchlist(items: Movie[], filters: WatchlistFilter)`
// If `filters.watched` is 'watched', it should calculate that.
// If `Movie` doesn't have `watched`, I can't filter.
//
// Let's look at what `useMovieStore` has.
// `watchlist: Movie[]`, `dismissed: string[]`.
// No `watched` list.
// 
// Maybe I missed something in `useMovieStore`?
// "dismissMovie", "removeFromWatchlist".
//
// If I am strictly implementing filtering, maybe I should assume "watched" is NOT "dismissed"?
// No, unrelated.
//
// Let's Re-read `agent_2_watchlist_filtering.md`.
// "Allow users to filter (by watched status)..."
// "Non-Goals: Don't implement the review UI or watched toggles".
// This implies someone ELSE is doing the toggling.
// I should probably support a `watched` boolean on the movie object in my utility, 
// even if the global `Movie` type doesn't have it yet. 
// TypeScript might complain if I pass `Movie[]` and try to access `.watched`.
//
// I will cast or use a generic.
//
// Updated Mock Data for Test:
// I'll add `watched: true` to some mocks, casting them to `any` or an extended type for the test setup.

const mockMoviesWithWatched = [
    { ...mockMovies[0], watched: true }, // A Movie
    { ...mockMovies[1], watched: false }, // B Movie
    { ...mockMovies[2], watched: false }, // C Movie
];

describe('watchlistUtils', () => {
    describe('filterWatchlist', () => {
        it('filters by search query (case insensitive)', () => {
            const result = filterWatchlist(mockMovies, { search: 'movie', watched: 'all', sortBy: 'title' });
            expect(result).toHaveLength(3);

            const result2 = filterWatchlist(mockMovies, { search: 'desc 1', watched: 'all', sortBy: 'title' });
            // Assuming search looks at description too? Plan didn't specify, but "search by title" in text. 
            // Let's stick to title first.
            const result3 = filterWatchlist(mockMovies, { search: 'B Movie', watched: 'all', sortBy: 'title' });
            expect(result3).toHaveLength(1);
            expect(result3[0].id).toBe('2');
        });

        it('filters by watched status', () => {
            // We need to tell TS that these movies have 'watched' prop
            const items = mockMoviesWithWatched as any[];

            const watched = filterWatchlist(items, { search: '', watched: 'watched', sortBy: 'title' });
            expect(watched).toHaveLength(1);
            expect(watched[0].id).toBe('1');

            const unwatched = filterWatchlist(items, { search: '', watched: 'unwatched', sortBy: 'title' });
            expect(unwatched).toHaveLength(2);
        });
    });

    describe('sortWatchlist', () => {
        it('sorts by title', () => {
            const sorted = sortWatchlist([...mockMovies], 'title');
            expect(sorted[0].title).toBe('A Movie');
            expect(sorted[1].title).toBe('B Movie');
            expect(sorted[2].title).toBe('C Movie');
        });

        it('sorts by rating (descending)', () => {
            const sorted = sortWatchlist([...mockMovies], 'rating');
            expect(sorted[0].id).toBe('3'); // 9.0
            expect(sorted[1].id).toBe('1'); // 8.5
            expect(sorted[2].id).toBe('2'); // 6.0
        });

        // "added" sort? 
        // `Movie` object doesn't have `addedAt`. 
        // Maybe `dbId` implies order? Or just array order (assuming appended)?
        // If sorting by "date added", and we assume the input array is IN order of addition (default),
        // then `sortWatchlist(movies, 'added')` might just reverse it (newest first)?
        // Or respect original order.
        // Let's assume 'added' means "Date Added Descencing" (Newest first).
        // Since we push to end, `reverse()` might be enough.

        it('sorts by date added (assuming inputs are chronological)', () => {
            // If input is [1, 2, 3] (oldest to newest)
            // Sort 'added' should probably store Newest First -> [3, 2, 1]
            const sorted = sortWatchlist([...mockMovies], 'added');
            expect(sorted[0].id).toBe('3');
            expect(sorted[2].id).toBe('1');
        });
    });
});
