'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWatched(dbId: string, isWatched: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('User not authenticated')
    }

    const { error } = await supabase
        .from('watchlists')
        .update({ watched: isWatched })
        .eq('id', dbId)
        .eq('user_id', user.id) // Security: Ensure user owns the item

    if (error) {
        console.error('Error toggling watched status:', error)
        throw new Error('Failed to update watched status')
    }

    revalidatePath('/watchlist')
}
