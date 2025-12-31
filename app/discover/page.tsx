import SwipeDeck from '@/components/SwipeDeck';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DiscoverPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center mb-1">
                <h1 className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent drop-shadow-sm">
                    Discover
                </h1>
                <p className="text-gray-400 mb-1">Swipe right to save to watchlist</p>
            </div>
            <SwipeDeck />
        </div>
    );
}
