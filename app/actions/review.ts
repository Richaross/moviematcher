'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function setReview(movieId: string, review: string, rating: number) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    // We assume the movie is in the watchlist.
    // Query by movie_id and user_id.
    const { error } = await supabase
        .from('watchlists')
        .update({
            review: review,
            rating: rating
        })
        .eq('user_id', user.id)
        .eq('movie_id', movieId)

    if (error) {
        console.error('Error setting review:', error)
        throw new Error('Failed to set review')
    }

    revalidatePath('/watchlist')
}

export async function deleteReview(movieId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('watchlists')
        .update({
            review: null,
            rating: null
        })
        .eq('user_id', user.id)
        .eq('movie_id', movieId)

    if (error) {
        console.error('Error deleting review:', error)
        throw new Error('Failed to delete review')
    }

    revalidatePath('/watchlist')
}
