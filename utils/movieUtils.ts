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
