'use client';

import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { ReactNode } from 'react';
import { useAuthSync } from '@/hooks/useAuthSync';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const isHome = pathname === '/';
    // Sync auth state with store
    useAuthSync();

    // Determine background based on path
    const isAuthPage = ['/login', '/signup', '/forgot-password', '/update-password'].includes(pathname);
    const bgImage = isAuthPage ? '/background_refined_2.png' : '/landing-bg.png';

    return (
        <main
            className={clsx(
                "min-h-screen relative",
                !isHome && "pt-20 container mx-auto px-4 pb-10"
            )}
        >
            {/* Global Background Image */}
            <div className="fixed inset-0 -z-50">
                <img
                    src={bgImage}
                    alt="Background"
                    className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-transparent" />
            </div>

            {children}
        </main>
    );
}
