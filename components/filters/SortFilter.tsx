'use client';

interface SortFilterProps {
    sortBy: string;
    onChange: (sort: string) => void;
}

export default function SortFilter({ sortBy, onChange }: SortFilterProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
                Sort By
            </h3>
            <select
                value={sortBy}
                onChange={(e) => onChange(e.target.value)}
                className="input-field appearance-none"
            >
                <option value="popularity.desc">Most Popular</option>
                <option value="vote_average.desc">Highest Rated</option>
                <option value="primary_release_date.desc">Newest Releases</option>
                <option value="revenue.desc">Highest Revenue</option>
            </select>
        </div>
    );
}
