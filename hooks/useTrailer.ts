import { useState } from 'react';
import { fetchMovieTrailer } from '@/lib/api';

export function useTrailer() {
    const [isOpen, setIsOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const openTrailer = async (movieId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const key = await fetchMovieTrailer(movieId);
            if (key) {
                setTrailerKey(key);
                setIsOpen(true);
            } else {
                setError('No trailer found');
                console.log('No trailer found for movie:', movieId);
            }
        } catch (err) {
            setError('Failed to fetch trailer');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const closeTrailer = () => {
        setIsOpen(false);
        setTrailerKey(null);
        setError(null);
    };

    return {
        isOpen,
        trailerKey,
        isLoading,
        error,
        openTrailer,
        closeTrailer,
    };
}
