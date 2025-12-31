'use client';

import { GENRES } from '@/lib/api';
import { clsx } from 'clsx';

interface GenreFilterProps {
    selectedGenres: number[];
    onChange: (genres: number[]) => void;
}

export default function GenreFilter({ selectedGenres, onChange }: GenreFilterProps) {
    const toggleGenre = (id: number) => {
        const newGenres = selectedGenres.includes(id)
            ? selectedGenres.filter((g) => g !== id)
            : [...selectedGenres, id];
        onChange(newGenres);
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
                Genres
            </h3>
            <div className="flex flex-wrap gap-2">
                {Object.entries(GENRES).map(([id, name]) => {
                    const genreId = parseInt(id);
                    const isSelected = selectedGenres.includes(genreId);
                    return (
                        <button
                            key={id}
                            onClick={() => toggleGenre(genreId)}
                            className={clsx(
                                'btn-filter-option',
                                isSelected
                                    ? 'btn-filter-option-active'
                                    : 'btn-filter-option-inactive'
                            )}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
