import { useState, useCallback } from 'react';

export function useCardInteraction(isSelectionMode: boolean, onToggleSelect?: () => void) {
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);

    const handleCardClick = useCallback(() => {
        if (isSelectionMode && onToggleSelect) {
            onToggleSelect();
        } else {
            setIsOverlayVisible(prev => !prev);
        }
    }, [isSelectionMode, onToggleSelect]);

    return { isOverlayVisible, handleCardClick };
}
