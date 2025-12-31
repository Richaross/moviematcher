'use client';

interface RuntimeFilterProps {
    runTime: number;
    onChange: (runtime: number) => void;
}

export default function RuntimeFilter({ runTime, onChange }: RuntimeFilterProps) {
    return (
        <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">
                Max Duration: {runTime} min
            </h3>
            <input
                type="range"
                min="60"
                max="240"
                step="15"
                value={runTime}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>60m</span>
                <span>120m</span>
                <span>180m</span>
                <span>240m</span>
            </div>
        </div>
    );
}
