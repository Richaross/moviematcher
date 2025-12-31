'use client';

import Link from 'next/link';
import { Heart, Menu, X, User as UserIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { useMovieStore } from '@/store/useMovieStore';
import Image from 'next/image';
import { useState } from 'react';
import { type User } from '@supabase/supabase-js';
import LogoutButton from './auth/LogoutButton';
import { AnimatePresence, motion } from 'framer-motion';

interface NavbarProps {
    user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
    const pathname = usePathname();
    const watchlistCount = useMovieStore((state) => state.watchlist.length);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <>
            <nav className={clsx(
                "fixed top-0 left-0 right-0 z-50 h-16 px-4 md:px-8 transition-colors duration-300",
                pathname === '/' ? "bg-transparent" : "glass-header"
            )}>
                <div className="h-full flex items-center justify-between">
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

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {user && (
                            <Link
                                href="/watchlist"
                                className={clsx(
                                    'nav-link flex items-center gap-2',
                                    pathname === '/watchlist' ? 'nav-link-active' : 'nav-link-inactive'
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
                        )}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-neutral-400 hidden lg:inline">{user.email}</span>
                                <LogoutButton />
                            </div>
                        ) : (
                            <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar & Backdrop */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-black/60 z-[998] backdrop-blur-sm md:hidden"
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-72 bg-neutral-900 border-l border-white/10 z-[999] shadow-2xl flex flex-col md:hidden"
                        >
                            {/* Header */}
                            <div className="p-4 flex items-center justify-between border-b border-white/10">
                                <h2 className="text-lg font-bold text-white">Menu</h2>
                                <button
                                    onClick={toggleMenu}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex flex-col gap-2">
                                {user && (
                                    <Link
                                        href="/watchlist"
                                        onClick={toggleMenu}
                                        className={clsx(
                                            'flex items-center gap-3 p-3 rounded-lg transition-colors',
                                            pathname === '/watchlist' ? 'bg-white/10 text-white' : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        <div className="relative">
                                            <Heart className={clsx('w-5 h-5', pathname === '/watchlist' ? 'fill-current' : '')} />
                                            {watchlistCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-neutral-900" />
                                            )}
                                        </div>
                                        <span className="font-medium">Watchlist</span>
                                        {watchlistCount > 0 && (
                                            <span className="ml-auto text-xs bg-white text-black font-bold px-2 py-0.5 rounded-full">
                                                {watchlistCount}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                <div className="h-px bg-white/10 my-2" />

                                {user ? (
                                    <>
                                        <div className="p-3 rounded-lg bg-white/5 border border-white/5 mb-2">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                                    <UserIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="text-xs text-neutral-400">Signed in as</span>
                                                    <span className="text-sm text-white font-medium truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full" onClick={toggleMenu}>
                                            <LogoutButton />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <Link
                                            href="/login"
                                            onClick={toggleMenu}
                                            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={toggleMenu}
                                            className="flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
