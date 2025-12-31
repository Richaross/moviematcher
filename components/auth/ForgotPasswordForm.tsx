'use client'

import { resetPassword } from '@/app/login/actions'
import Link from 'next/link'

export default function ForgotPasswordForm() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
            <form className="flex flex-col gap-4 w-full max-w-md bg-neutral-800 p-8 rounded-lg shadow-lg border border-neutral-700">
                <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>

                <p className="text-sm text-neutral-400 text-center mb-6">
                    Enter your email to receive a reset link. Don&apos;t worry, it happens!
                </p>

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

                <div className="flex gap-4 mt-4 flex-col">
                    <button
                        formAction={resetPassword}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded transition-colors"
                    >
                        Send Reset Link
                    </button>

                    <Link href="/login" className="text-center text-sm text-neutral-400 hover:text-white transition-colors">
                        Back to login
                    </Link>
                </div>
            </form>
        </div>
    )
}
