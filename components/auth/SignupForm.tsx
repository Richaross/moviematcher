'use client'

import { signup } from '@/app/login/actions'
import { useState } from 'react'
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { validateSignupInput, passwordRegex } from '@/utils/validation'

export default function SignupForm({ message }: { message?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Form State
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Derived State (Pure Function Validation)
    const { emailsMatch, passwordsMatch, passwordValid, isFormValid } = validateSignupInput(
        email,
        confirmEmail,
        password,
        confirmPassword
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <form className="flex flex-col gap-4 w-full max-w-md bg-neutral-800 p-8 rounded-lg shadow-lg border border-neutral-700">
                <h1 className="text-2xl font-bold mb-2 text-center">Create Account</h1>
                <p className="text-sm text-neutral-400 text-center mb-6">
                    Join Movie Matchmaker today!
                </p>

                {message && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded text-sm text-center flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {message}
                    </div>
                )}

                {/* Email Fields */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="email" className="text-sm font-medium text-neutral-300">Email:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="p-3 rounded bg-neutral-900 border border-neutral-700 focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmEmail" className="text-sm font-medium text-neutral-300">Confirm Email:</label>
                    <input
                        id="confirmEmail"
                        name="confirmEmail"
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        required
                        className="p-3 rounded bg-neutral-900 border border-neutral-700 focus:border-red-500 focus:outline-none transition-colors"
                        placeholder="Confirm your email"
                    />
                    {emailsMatch && (
                        <div className="flex items-center gap-2 text-green-500 text-xs animate-in fade-in slide-in-from-top-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Emails match</span>
                        </div>
                    )}
                </div>

                {/* Password Fields */}
                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-neutral-300">Password:</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    {/* Password requirements hint */}
                    <div className="text-xs text-neutral-500 mt-1 space-y-1">
                        <p className={passwordRegex.test(password) ? 'text-green-500' : 'text-neutral-500'}>
                            Must be 6+ chars, include Upper, Lower, Number, & Symbol.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-300">Confirm Password:</label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="p-3 rounded bg-neutral-900 border border-neutral-700 focus:border-red-500 focus:outline-none transition-colors w-full pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {passwordsMatch && (
                        <div className="flex items-center gap-2 text-green-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Passwords match!</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-4 mt-4">
                    <button
                        formAction={signup}
                        disabled={!isFormValid}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Sign Up
                    </button>

                    <p className="text-center text-sm text-neutral-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white hover:underline">
                            Log in here
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
