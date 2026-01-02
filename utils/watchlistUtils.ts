import { Movie } from '@/lib/api';

export type WatchlistSortKey = 'title' | 'rating' | 'added';
export type WatchstatusFilter = 'all' | 'watched' | 'unwatched';

export interface WatchlistFilter {
    search: string;
    watched: WatchstatusFilter;
    sortBy: WatchlistSortKey;
}

// Extend Movie locally to include optional 'watched' property for filtering
// In the future this might be part of the core Movie type
export type WatchlistMovie = Movie & { watched?: boolean };

export function filterWatchlist(
    items: WatchlistMovie[],
    filters: WatchlistFilter
): WatchlistMovie[] {
    let filtered = [...items];

    // 1. Text Search
    if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(query)
        );
    }

    // 2. Watched Status
    if (filters.watched !== 'all') {
        const isWatched = filters.watched === 'watched';
        filtered = filtered.filter(item => !!item.watched === isWatched);
    }

    // 3. Sorting is usually done separately or as final step.
    // The plan said `sortWatchlist` is separate.
    // But `filterWatchlist` test used `sortBy` in input.
    // The implementation plan listed `sortWatchlist` as a separate function, 
    // but the test I wrote passed `filters` (which includes `sortBy`) to `filterWatchlist`?
    // Wait, let me check my test code again.
    // `filterWatchlist(mockMovies, { search: 'movie', watched: 'all', sortBy: 'title' })`
    // My test passes the whole filter object.
    // I should probably Call sort inside filter OR return unsorted and let component call sort.
    // Plan: "Implement pure functions: filterWatchlist... sortWatchlist..."
    // Usually better to have them separate for composability, but nice if one handles all.
    // Let's keep them separate as per plan, but `filterWatchlist` can ignore `sortBy` or I can update the test/utility.

    // I will implement `sortWatchlist` and CALL it inside `filterWatchlist` IF `filters` are passed?
    // Or just let `filterWatchlist` ignore sortBy. 
    // The component usually does `const visible = sortWatchlist(filterWatchlist(items, filters), filters.sortBy)`.
    // My test passed `sortBy` to `filterWatchlist`, but verified LENGTH, not order in the filter tests.
    // So if `filterWatchlist` ignores `sortBy`, it's fine.

    return filtered;
}

export function sortWatchlist(
    items: WatchlistMovie[],
    sortBy: WatchlistSortKey
): WatchlistMovie[] {
    const sorted = [...items];

    switch (sortBy) {
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'added':
            // Assuming the array is naturally ordered by addition time (oldest -> newest)
            // 'added' usually means "Recently Added" -> Reverse order
            return sorted.reverse();
        default:
            return sorted;
    }
}
