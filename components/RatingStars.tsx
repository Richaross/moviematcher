import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
    rating?: number; // 0-10
    onChange?: (rating: number) => void;
    readOnly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function RatingStars({ rating = 0, onChange, readOnly = false, size = 'md' }: RatingStarsProps) {
    const [hoverValue, setHoverValue] = useState<number | null>(null);

    const displayRating = hoverValue !== null ? hoverValue : rating;

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        if (readOnly || !onChange) return;

        const { left, width } = e.currentTarget.getBoundingClientRect();
        // Fallback for 0 width (testing)
        if (width === 0) return;

        const x = e.clientX - left;
        const isHalf = x < width / 2;

        const value = (index * 2) + (isHalf ? 1 : 2);
        setHoverValue(value);
    };

    const handleMouseLeave = () => {
        if (readOnly) return;
        setHoverValue(null);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
        if (readOnly || !onChange) return;

        // Use hoverValue if present (most accurate for user interaction)
        if (hoverValue !== null) {
            onChange(hoverValue);
            return;
        }

        // Fallback calculation for direct clicks (e.g. tests or touch without hover)
        const { left, width } = e.currentTarget.getBoundingClientRect();
        if (width === 0) {
            // Default to full star if dimensions unavailable (e.g. testing default)
            onChange((index + 1) * 2);
            return;
        }

        const x = e.clientX - left;
        const isHalf = x < width / 2;
        const value = (index * 2) + (isHalf ? 1 : 2);
        onChange(value);
    };

    return (
        <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
            {[0, 1, 2, 3, 4].map((index) => {
                // Determine fill for this star
                // Star values:
                // 0: 1-2
                // 1: 3-4
                // 2: 5-6
                // ...
                const starMin = (index * 2) + 1;
                const starMax = (index * 2) + 2;

                // Example: rating 8.5
                // index 3 (7-8): full
                // index 4 (9-10): empty

                const isFull = displayRating >= starMax;
                const isHalf = displayRating >= starMin && displayRating < starMax;

                return (
                    <button
                        key={index}
                        type="button"
                        disabled={readOnly}
                        onMouseMove={(e) => handleMouseMove(e, index)}
                        onClick={(e) => handleClick(e, index)}
                        className={cn(
                            "relative transition-transform focus:outline-none p-0.5",
                            readOnly ? "cursor-default" : "cursor-pointer hover:scale-105 active:scale-95"
                        )}
                        aria-label={`Rate ${(index + 1) * 2}`}
                    >
                        {/* Background Star (Empty) */}
                        <Star
                            className={cn(
                                sizeClasses[size],
                                "text-gray-700"
                            )}
                        />

                        {/* Foreground Star (Partial/Full) */}
                        <div
                            className={cn(
                                "absolute inset-0.5 overflow-hidden transition-[width] duration-75 pointer-events-none",
                                isFull ? "w-full" : isHalf ? "w-1/2" : "w-0"
                            )}
                        >
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    "text-yellow-500 fill-yellow-500"
                                )}
                            />
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
