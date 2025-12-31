import { useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState } from 'react';

interface UseCardMotionProps {
    onSwipe: (direction: 'left' | 'right') => void;
    index: number;
}

export function useCardMotion({ onSwipe }: UseCardMotionProps) {
    const [exitX, setExitX] = useState<number | null>(null);
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Color overlays
    const yepOpacity = useTransform(x, [0, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-150, 0], [1, 0]);

    const handleDragEnd = (
        event: MouseEvent | TouchEvent | PointerEvent,
        info: PanInfo
    ) => {
        if (info.offset.x > 100) {
            setExitX(2000);
            onSwipe('right');
        } else if (info.offset.x < -100) {
            setExitX(-2000);
            onSwipe('left');
        }
    };

    return {
        x,
        rotate,
        opacity,
        exitX,
        yepOpacity,
        nopeOpacity,
        handleDragEnd
    };
}
