'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ErrorContent() {
    const searchParams = useSearchParams()
    const message = searchParams.get('message') || "Sorry, we couldn't authenticate you."

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4 text-center">
            <h1 className="text-4xl font-bold mb-4 text-red-500">Something went wrong</h1>
            <p className="text-neutral-300 text-lg mb-8 max-w-md">{message}</p>
            <Link
                href="/login"
                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3 px-6 rounded transition-colors"
            >
                Try Again
            </Link>
        </div>
    )
}

export default function ErrorPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <ErrorContent />
        </Suspense>
    )
}
