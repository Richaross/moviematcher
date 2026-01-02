import { Movie } from '@/lib/api';

/**
 * Filters movies to exclude those already in watchlist or dismissed.
 * Pure function for testability.
 */
export function filterDeckMovies(
    movies: Movie[],
    isInWatchlist: (id: string) => boolean,
    isDismissed: (id: string) => boolean
): Movie[] {
    return movies.filter(
        (m) => !isInWatchlist(m.id) && !isDismissed(m.id)
    );
}

/**
 * Removes duplicate movies from an array based on their ID.
 * Keeps the last occurrence if duplicates exist, based on Map behavior.
 */
export function deduplicateMovies(movies: Movie[]): Movie[] {
    return Array.from(
        new Map(movies.map(m => [m.id, m])).values()
    );
}
