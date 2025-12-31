'use client'

import { updatePassword } from '@/app/login/actions'
import { useState } from 'react'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function UpdatePasswordForm({ message }: { message?: string }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Track values for matching validation
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    // Derived state
    const isMatching = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <form className="flex flex-col gap-4 w-full max-w-md bg-neutral-800 p-8 rounded-lg shadow-lg border border-neutral-700">
                <h1 className="text-2xl font-bold mb-4 text-center">Update Password</h1>

                {message && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded text-sm text-center">
                        {message}
                    </div>
                )}

                {/* Note: In a reset flow via email link, the user is already authenticated by the link, 
           so "Old Password" is not required nor possible if they forgot it. 
           We only ask for New Password and Confirmation. */}

                <div className="flex flex-col gap-2">
                    <label htmlFor="password" className="text-sm font-medium text-neutral-300">New Password:</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
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
                            minLength={6}
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
                    {isMatching && (
                        <div className="flex items-center gap-2 text-green-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1">
                            <CheckCircle className="w-4 h-4" />
                            <span>Passwords match!</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        formAction={updatePassword}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!isMatching}
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </div>
    )
}
