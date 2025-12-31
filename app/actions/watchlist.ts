'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { Movie } from '@/lib/api'

export async function addToWatchlist(movie: Movie) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
        .from('watchlists')
        .insert({
            user_id: user.id,
            movie_id: movie.id,
            title: movie.title,
            poster_path: movie.poster, // Note: Mapping 'poster' (frontend) to 'poster_path' (db)
            release_date: movie.year.toString(), // Simplified
            vote_average: movie.rating,
            overview: movie.description
        })
        .select()
        .single()

    if (error) {
        console.error('Error adding to watchlist:', error)
        throw new Error('Failed to add to watchlist')
    }

    revalidatePath('/watchlist')
    return data.id
}

export async function removeFromWatchlist(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // Deleting by the Primary Key (UUID of the row)
    const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Double check for safety

    if (error) {
        console.error('Error removing from watchlist:', error)
        throw new Error('Failed to remove from watchlist')
    }

    revalidatePath('/watchlist')
}

export async function getWatchlist() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching watchlist:', error)
        return []
    }

    // Transform DB rows back to Movie interface
    interface WatchlistRow {
        movie_id: number;
        id: string;
        title: string;
        poster_path: string;
        release_date: string;
        vote_average: number;
        overview: string;
    }

    // Transform DB rows back to Movie interface
    return (data as unknown as WatchlistRow[]).map((row) => ({
        id: row.movie_id.toString(), // The TMDB ID (converted to string for frontend)
        dbId: row.id,     // The row UUID (for deletion)
        title: row.title,
        poster: row.poster_path,
        year: parseInt(row.release_date) || 0,
        rating: row.vote_average,
        description: row.overview,
        genre: [] // We didn't store genres to save complexity, optional usage
    })) as Movie[]
}
