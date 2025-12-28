'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useMovieStore } from '@/store/useMovieStore';
import Image from 'next/image';

export default function Navbar() {
    const pathname = usePathname();
    const watchlistCount = useMovieStore((state) => state.watchlist.length);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-header h-16 px-4 md:px-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="relative w-8 h-8 md:w-10 md:h-10 text-white">
                    <Image
                        src="/logo.png"
                        alt="MovieMatcher Logo"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 32px, 40px"
                    />
                </div>
                <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent text-lg md:text-xl">
                    MovieMatcher
                </span>
            </Link>

            <div className="flex items-center gap-4">
                <Link
                    href="/watchlist"
                    className={clsx(
                        'nav-link',
                        pathname === '/watchlist'
                            ? 'nav-link-active'
                            : 'nav-link-inactive'
                    )}
                >
                    <div className="relative">
                        <Heart
                            className={clsx(
                                'w-5 h-5',
                                pathname === '/watchlist' ? 'fill-current' : ''
                            )}
                        />
                        {watchlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-white text-red-600 text-[10px] font-bold rounded-full flex items-center justify-center">
                                {watchlistCount}
                            </span>
                        )}
                    </div>
                    <span className="font-medium">Watchlist</span>
                </Link>
            </div>
        </nav>
    );
}
