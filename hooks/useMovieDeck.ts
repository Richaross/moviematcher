import { useState, useEffect } from 'react';
import { fetchMovies, Movie } from '@/lib/api';
import { useMovieStore } from '@/store/useMovieStore';
import { filterDeckMovies } from '@/utils/movieUtils';

export function useMovieDeck() {
    const {
        isInWatchlist,
        isDismissed,
        filters,
        currentPage,
        addToWatchlist,
        dismissMovie,
        nextPage
    } = useMovieStore();

    const [fetchedMovies, setFetchedMovies] = useState<Movie[]>([]);
    const [deck, setDeck] = useState<Movie[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    useEffect(() => {
        const loadMovies = async () => {
            setIsLoaded(false);
            const data = await fetchMovies(currentPage, filters);
            setFetchedMovies(data);
            setIsLoaded(true);
        };
        loadMovies();
    }, [filters, currentPage]);

    useEffect(() => {
        // Use pure function for filtering (improves testability)
        const remaining = filterDeckMovies(fetchedMovies, isInWatchlist, isDismissed);

        // Use timeout to avoid synchronous setState warning
        const timer = setTimeout(() => {
            setDeck(remaining);
        }, 0);

        return () => clearTimeout(timer);
    }, [fetchedMovies, isInWatchlist, isDismissed]);

    const handleSwipe = (direction: 'left' | 'right', id: string) => {
        const movie = deck.find((m) => m.id === id);
        if (!movie) return;

        if (direction === 'right') {
            addToWatchlist(movie);
        } else {
            dismissMovie(id);
        }

        setTimeout(() => {
            setDeck((prev) => prev.filter((m) => m.id !== id));
        }, 200);
    };

    const handleLoadMore = () => {
        setIsLoadingMore(true);
        nextPage();
        setIsLoadingMore(false);
    };

    return {
        deck,
        isLoaded,
        isLoadingMore,
        handleSwipe,
        handleLoadMore,
    };
}
