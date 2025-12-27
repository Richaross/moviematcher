
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
    id: string;
    title: string;
    poster: string;
    year: number;
    genre: string[];
    rating: number;
    description: string;
}

interface TMDBMovie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    genre_ids: number[];
    vote_average: number;
    overview: string;
}

interface TMDBResponse {
    results: TMDBMovie[];
}

// Map genre IDs to names (simplified list for now)
export const GENRES: Record<number, string> = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Sci-Fi',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
};

export interface FilterOptions {
    genres: number[];
    yearRange: [number, number];
    minRating: number;
    sortBy: string;
    runTime: number;
}

export async function fetchMovies(page: number = 1, filters?: FilterOptions): Promise<Movie[]> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB_API_KEY is missing. Returning empty list.');
        return [];
    }

    try {
        // Base URL with default sort if not provided
        const sortBy = filters?.sortBy || 'popularity.desc';
        let url = `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&sort_by=${sortBy}&include_adult=false&include_video=false&page=${page}`;

        if (filters) {
            if (filters.genres.length > 0) {
                url += `&with_genres=${filters.genres.join(',')}`;
            }
            // Year range
            url += `&primary_release_date.gte=${filters.yearRange[0]}-01-01`;
            url += `&primary_release_date.lte=${filters.yearRange[1]}-12-31`;

            // Rating
            url += `&vote_average.gte=${filters.minRating}`;
            url += `&vote_count.gte=100`; // Ensure some reliability

            // Runtime
            url += `&with_runtime.lte=${filters.runTime}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch movies: ${response.statusText}`);
        }

        const data: TMDBResponse = await response.json();

        return data.results.map((movie) => ({
            id: movie.id.toString(),
            title: movie.title,
            poster: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/500x750?text=No+Poster',
            year: movie.release_date ? new Date(movie.release_date).getFullYear() : 0,
            genre: movie.genre_ids.map(id => GENRES[id] || 'Unknown'),
            rating: movie.vote_average,
            description: movie.overview,
        }));
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}
