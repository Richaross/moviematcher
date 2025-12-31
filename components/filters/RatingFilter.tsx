'use client';

interface RatingFilterProps {
    minRating: number;
    onChange: (rating: number) => void;
}

export default function RatingFilter({ minRating, onChange }: RatingFilterProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
                Minimum Rating: {minRating}
            </h3>
            <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0</span>
                <span>5</span>
                <span>10</span>
            </div>
        </div>
    );
}
