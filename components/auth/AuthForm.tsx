'use client'

import { login } from '@/app/login/actions'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function AuthForm({ message }: { message?: string }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <form className="flex flex-col gap-4 w-full max-w-md bg-neutral-800 p-8 rounded-lg shadow-lg border border-neutral-700">
                <h1 className="text-2xl font-bold mb-4 text-center">Movie Matchmaker</h1>

                {/* Error Message Display */}
                {message && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded text-sm text-center">
                        {message}
                    </div>
                )}

                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="p-3 rounded bg-neutral-900 border border-neutral-700 focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="flex flex-col gap-2 relative">
                    <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password:</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            className="p-3 rounded bg-neutral-900 border border-neutral-700 focus:border-red-500 focus:outline-none transition-colors w-full pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end mt-1">
                    <a href="/forgot-password" className="text-xs text-neutral-400 hover:text-white transition-colors">
                        Forgot password?
                    </a>
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        formAction={login}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
                    >
                        Log in
                    </button>
                </div>

                <p className="text-center text-sm text-neutral-400 mt-4">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="text-white hover:underline">
                        Sign up here
                    </Link>
                </p>
            </form>
        </div>
    )
}
