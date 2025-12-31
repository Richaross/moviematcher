'use client';

interface YearFilterProps {
    yearRange: [number, number];
    onChange: (range: [number, number]) => void;
}

export default function YearFilter({ yearRange, onChange }: YearFilterProps) {
    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange([parseInt(e.target.value), yearRange[1]]);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange([yearRange[0], parseInt(e.target.value)]);
    };

    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
                Year: {yearRange[0]} - {yearRange[1]}
            </h3>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">
                        From
                    </label>
                    <input
                        type="number"
                        min="1900"
                        max="2025"
                        value={yearRange[0]}
                        onChange={handleMinChange}
                        className="input-field"
                    />
                </div>
                <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">
                        To
                    </label>
                    <input
                        type="number"
                        min="1900"
                        max="2025"
                        value={yearRange[1]}
                        onChange={handleMaxChange}
                        className="input-field"
                    />
                </div>
            </div>
        </div>
    );
}
