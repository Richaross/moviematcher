import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMovieStore } from '@/store/useMovieStore';
import { createClient } from '@/utils/supabase/client';

export function useAuthSync() {
    const pathname = usePathname();
    const { initializeForUser, fetchWatchlist, userId } = useMovieStore();
    const initializingRef = useRef(false);

    // Track current auth state to avoid redundant calls
    const currentUserIdRef = useRef<string | null>(userId || null);

    useEffect(() => {
        const supabase = createClient();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (initializingRef.current) return;

            if (session?.user) {
                // If user changed, or store doesn't match session
                if (currentUserIdRef.current !== session.user.id) {
                    initializingRef.current = true;
                    currentUserIdRef.current = session.user.id;

                    try {
                        // Just set the user ID - no keys needed
                        initializeForUser(session.user.id);
                        await fetchWatchlist();
                    } catch (err) {
                        console.error('Failed to initialize user session', err);
                    } finally {
                        initializingRef.current = false;
                    }
                }
            } else {
                // Logout detected
                if (currentUserIdRef.current) {
                    currentUserIdRef.current = null;
                    useMovieStore.getState().resetStore();
                }
            }
        });

        // Initial check on mount OR navigation
        // This handles cases where onAuthStateChange doesn't fire immediately on redirect
        if (!initializingRef.current) {
            supabase.auth.getUser().then(async ({ data: { user } }) => {
                if (user) {
                    if (currentUserIdRef.current !== user.id || !useMovieStore.getState().userId) {
                        initializingRef.current = true;
                        currentUserIdRef.current = user.id;
                        try {
                            initializeForUser(user.id);
                            await fetchWatchlist();
                        } catch (err) {
                            console.error('Failed to initialize user session', err);
                        } finally {
                            initializingRef.current = false;
                        }
                    }
                } else {
                    // No user found, ensure clean state
                    if (useMovieStore.getState().userId) {
                        useMovieStore.getState().resetStore();
                        currentUserIdRef.current = null;
                    }
                }
            });
        }

        return () => {
            subscription.unsubscribe();
        };
    }, [initializeForUser, fetchWatchlist, pathname]);
}
