
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export interface Movie {
    id: string;
    dbId?: string;
    title: string;
    poster: string;
    year: number;
    genre: string[];
    rating: number;
    description: string;
    watched?: boolean;
    review?: string;
    userRating?: number;
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

interface TMDBVideo {
    key: string;
    site: string;
    type: string;
}

interface TMDBVideoResponse {
    results: TMDBVideo[];
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
        console.error('TMDB_API_KEY is missing');
        return [];
    }

    try {
        const queryParams = new URLSearchParams({
            api_key: TMDB_API_KEY,
            language: 'en-US',
            sort_by: filters?.sortBy || 'popularity.desc',
            include_adult: 'false',
            include_video: 'false',
            page: page.toString(),
        });

        if (filters) {
            if (filters.genres.length > 0) {
                queryParams.append('with_genres', filters.genres.join(','));
            }

            // Year range
            queryParams.append('primary_release_date.gte', `${filters.yearRange[0]}-01-01`);
            queryParams.append('primary_release_date.lte', `${filters.yearRange[1]}-12-31`);

            // Rating
            queryParams.append('vote_average.gte', filters.minRating.toString());
            queryParams.append('vote_count.gte', '100'); // Ensure some reliability

            // Runtime
            queryParams.append('with_runtime.lte', filters.runTime.toString());
        }

        const url = `${BASE_URL}/discover/movie?${queryParams.toString()}`;
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
        console.error('Error in fetchMovies:', error);
        return [];
    }
}

export async function fetchMovieTrailer(movieId: string): Promise<string | null> {
    if (!TMDB_API_KEY) return null;

    try {
        const queryParams = new URLSearchParams({
            api_key: TMDB_API_KEY,
            language: 'en-US'
        });

        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?${queryParams.toString()}`
        );

        if (!response.ok) return null;

        const data: TMDBVideoResponse = await response.json();
        const videos = data.results || [];

        // Find the first official trailer on YouTube
        const trailer = videos.find(
            (v) => v.site === 'YouTube' && v.type === 'Trailer'
        );

        return trailer ? trailer.key : null;
    } catch (error) {
        console.error('Error fetching trailer:', error);
        return null;
    }
}
